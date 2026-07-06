import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { CatalogStore, CatalogProduct, Operator } from '../../stores/catalog.store';
import { NcmService } from '../../services/ncm.service';
import { DetalheAtributo } from '../../models/ncm-attributes.model';
import { IconComponent } from '../ui/icon.component';

type ViewMode = 'list' | 'method-select' | 'quick-create' | 'edit-details' | 'add-operator';
type MainTab = 'products' | 'operators';
type ModalTab = 'general' | 'attributes';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './product-catalog.component.html'
})
export class ProductCatalogComponent implements OnInit {
  readonly ATRIBUTOS_FISCAIS = ['ATT_20130']; // cClassTrib

  store = inject(CatalogStore);
  ncmService = inject(NcmService); // Injeção do Serviço de API

  ngOnInit() {
    this.store.loadProducts();
  }

  viewMode = signal<ViewMode>('list');
  mainTab = signal<MainTab>('products');
  modalTab = signal<ModalTab>('general');
  showToast = signal(false);
  toastMessage = signal('');

  showAlertDialog = signal(false);
  alertTitle = signal('');
  alertMessage = signal('');

  showConfirmDialog = signal(false);
  confirmTitle = signal('');
  confirmMessage = signal('');

  tempNcmSearch = '';
  filteredNcms = signal<{ code: string, desc: string }[]>([]);
  isNcmSelected = signal(false);

  loadingAtributos = signal(false);
  atributosDinamicos = signal<DetalheAtributo[]>([]);

  mostrarOpcionais = signal(false);

  toggleOpcionais() {
    this.mostrarOpcionais.update(v => !v);
  }

  temOpcionais(): boolean {
    return this.atributosDinamicos().some(a =>
      !a.obrigatorio &&
      !this.isFiscalCritico(a) &&
      this.shouldShowAttribute(a)
    );
  }

  contarOpcionais(): number {
    return this.atributosDinamicos().filter(a =>
      !a.obrigatorio &&
      !this.isFiscalCritico(a) &&
      this.shouldShowAttribute(a)
    ).length;
  }

  newOperator: Operator = {
    id: '',
    nome: '',
    pais: '',
    tin: '',
    logradouro: '',
    cidade: ''
  };

  initialState: CatalogProduct = {
    companyId: '',
    cpfCnpjRaiz: '',
    codigo: '',
    versao: '1',
    ncm: '',
    denominacao: '',
    detalhamentoComplementar: '',
    modalidade: 'IMPORTACAO',
    situacao: 'RASCUNHO',
    atributos: [],
    fabricante: { tipo: 'DESCONHECIDO' },
    operadorEstrangeiro: undefined
  };

  currentProduct: CatalogProduct = JSON.parse(JSON.stringify(this.initialState));

  filteredProducts = computed(() => {
    return this.store.products().filter(p => p.companyId === this.store.currentCompanyId());
  });

  currentCompanyName = computed(() => {
    const comp = this.store.companies().find(c => c.id === this.store.currentCompanyId());
    return comp ? comp.name : '';
  });

  // Actions
  openMethodSelection() {
    this.viewMode.set('method-select');
    this.currentProduct = JSON.parse(JSON.stringify(this.initialState));
    this.currentProduct.companyId = this.store.currentCompanyId();
    this.tempNcmSearch = '';
    this.isNcmSelected.set(false);
  }

  openAddOperator() {
    this.newOperator = {
      id: '',
      nome: '',
      pais: '',
      tin: '',
      logradouro: '',
      cidade: ''
    };
    this.viewMode.set('add-operator');
  }

  filterNcms() {
    this.isNcmSelected.set(false);
    if (!this.tempNcmSearch) {
      this.filteredNcms.set([]);
      return;
    }
    const term = this.tempNcmSearch.toLowerCase();
    const results = this.store.ncmList.filter(n =>
      n.code.includes(term) || n.desc.toLowerCase().includes(term)
    );
    this.filteredNcms.set(results);
    this.currentProduct.ncm = this.tempNcmSearch;
  }

  selectNcm(code: string) {
    this.currentProduct.ncm = code;
    this.tempNcmSearch = code;
    this.isNcmSelected.set(true);
    this.filteredNcms.set([]);
  }

  quickSaveAndFetchAttributes() {
    if (!this.currentProduct.codigo || !this.currentProduct.ncm || !this.currentProduct.denominacao) {
      this.alertTitle.set('Campos Obrigatórios');
      this.alertMessage.set('Preencha os campos obrigatórios (SKU, NCM, Denominação).');
      this.showAlertDialog.set(true);
      return;
    }

    this.loadingAtributos.set(true);

    this.ncmService.buscarAtributos(this.currentProduct.ncm).subscribe({
      next: (retorno) => {
        const listaOrganizada = this.processarHierarquia(retorno.detalhesAtributos);
        this.atributosDinamicos.set(listaOrganizada);

        this.currentProduct.atributos = listaOrganizada.map(attr => ({
          codigoAtributo: attr.codigo,
          nome: attr.nome,
          valor: ''
        }));

        this.triggerToast('Atributos carregados da Receita Federal!');

        this.modalTab.set('attributes');
        this.viewMode.set('edit-details');
        this.loadingAtributos.set(false);
      },
      error: (err) => {
        console.error(err);
        this.alertTitle.set('Erro de comunicação');
        this.alertMessage.set('Erro ao buscar atributos na Receita Federal. O servidor Backend está rodando?');
        this.showAlertDialog.set(true);
        this.loadingAtributos.set(false);
      }
    });
  }

  // aplaina a estrutura da api que vem aninhada (pai -> filhos).
  // coloca referencia do pai no filho para a gente controlar a exibicao condicional no html
  processarHierarquia(atributosBrutos: any[]): DetalheAtributo[] {
    const listaFinal: DetalheAtributo[] = [];

    atributosBrutos.forEach(pai => {
      // 1. Adiciona o Pai na lista
      listaFinal.push(pai);

      // 2. Se o pai tem filhos (condicionados), processa eles
      if (pai.condicionados && pai.condicionados.length > 0) {

        pai.condicionados.forEach((condicao: any) => {
          const filho = condicao.atributo;

          // vincula quem é o pai e o valor esperado para ativar esse filho
          filho.codigoPai = pai.codigo;
          filho.valorEsperado = condicao.condicao.valor;

          // Importante: Inicializa o valor do filho como vazio para não dar erro no ngModel
          filho.valorUsuario = '';

          // 3. Adiciona o filho na lista principal também
          listaFinal.push(filho);
        });
      }
    });

    return listaFinal;
  }

  isFiscalCritico(attr: DetalheAtributo): boolean {
    return this.ATRIBUTOS_FISCAIS.includes(attr.codigo);
  }

  // decide se renderiza ou nao o atributo dinâmico com base na resposta do pai
  shouldShowAttribute(attr: DetalheAtributo): boolean {
    // se nao tem pai, é raiz e exibe direto
    if (!attr.codigoPai) return true;

    // acha o pai pra checar o que foi respondido nele
    const pai = this.atributosDinamicos().find(a => a.codigo === attr.codigoPai);

    if (!pai) return false;

    // forca conversao pra string pq a api do portal unico as vezes retorna booleano puro ou numero e quebra a comparacao
    const valorPai = String(pai.valorUsuario);
    const valorNecessario = String(attr.valorEsperado);

    return valorPai === valorNecessario;
  }

  saveOperator() {
    if (!this.newOperator.nome || !this.newOperator.pais) {
      this.alertTitle.set('Dados Incompletos');
      this.alertMessage.set('Nome e País são obrigatórios');
      this.showAlertDialog.set(true);
      return;
    }
    this.newOperator.id = Date.now().toString();
    this.store.addOperator(this.newOperator);
    this.triggerToast('Operador adicionado com sucesso!');
    this.closeModal();
  }

  editProduct(prod: CatalogProduct) {
    this.currentProduct = JSON.parse(JSON.stringify(prod));
    if (!this.currentProduct.fabricante) {
      this.currentProduct.fabricante = { tipo: 'DESCONHECIDO' };
    }

    if (!this.currentProduct.operadorEstrangeiro) {
      this.currentProduct.operadorEstrangeiro = {
        id: '',
        nome: '',
        pais: '',
        tin: '',
        logradouro: '',
        cidade: ''
      };
    }

    // se ja tem ncm, busca as regras dela de novo na api pra desenhar o form
    if (this.currentProduct.ncm) {
      this.loadingAtributos.set(true);

      const ncmParaBuscar = this.currentProduct.ncm.replace(/\./g, '');

      this.ncmService.buscarAtributos(ncmParaBuscar).subscribe({
        next: (retorno) => {
          // monta a estrutura de perguntas
          const listaOrganizada = this.processarHierarquia(retorno.detalhesAtributos);

          // preenche com o que ja estava gravado
          listaOrganizada.forEach(regra => {
            const salvo = this.currentProduct.atributos.find(a => a.codigoAtributo === regra.codigo);
            if (salvo) {
              // converte pra boolean se for tipo booleano
              if (regra.formaPreenchimento === 'BOOLEANO') {
                regra.valorUsuario = salvo.valor === 'true';
              } else {
                regra.valorUsuario = salvo.valor;
              }
            }
          });

          this.atributosDinamicos.set(listaOrganizada);
          this.loadingAtributos.set(false);
        },
        error: (err) => {
          console.error(err);
          this.alertTitle.set('Erro ao carregar NCM');
          this.alertMessage.set('Não foi possível carregar as regras da NCM. Alguns campos podem não aparecer.');
          this.showAlertDialog.set(true);
          this.loadingAtributos.set(false);
        }
      });
    }

    this.modalTab.set('general');
    this.viewMode.set('edit-details');
  }

  saveFinal() {
    // junta as respostas do form dinamico no objeto pra salvar
    let erroAtributos = false;

    this.currentProduct.atributos.forEach(prodAttr => {
      const regra = this.atributosDinamicos().find(r => r.codigo === prodAttr.codigoAtributo);

      // atualiza se o usuario preencheu
      if (regra) {
        // se for obrigatorio, estiver visivel na tela e vazio, bloqueia
        const valorInvalido = regra.valorUsuario === null || regra.valorUsuario === undefined || regra.valorUsuario === '';

        if (regra.obrigatorio && this.shouldShowAttribute(regra) && valorInvalido) {
          erroAtributos = true;
        }

        if (regra.valorUsuario !== null && regra.valorUsuario !== undefined) {
          prodAttr.valor = regra.valorUsuario.toString();
        }
      }
    });

    if (erroAtributos) {
      this.alertTitle.set('Atributos Obrigatórios');
      this.alertMessage.set('Existem atributos obrigatórios da NCM não preenchidos. Verifique a aba "Atributos NCM".');
      this.showAlertDialog.set(true);
      this.modalTab.set('attributes');
      return;
    }

    // se for CONHECIDO, precisa selecionar o fabricante
    if (this.currentProduct.fabricante.tipo === 'CONHECIDO' && !this.currentProduct.fabricante.dados) {
      this.alertTitle.set('Fabricante Obrigatório');
      this.alertMessage.set('Por favor, selecione um Fabricante na aba "Dados Gerais".');
      this.showAlertDialog.set(true);
      this.modalTab.set('general');
      return;
    }

    // valida exportador estrangeiro
    if (!this.currentProduct.operadorEstrangeiro?.nome) {
      this.alertTitle.set('Exportador Obrigatório');
      this.alertMessage.set('Por favor, selecione ou informe o Exportador na aba "Dados Gerais".');
      this.showAlertDialog.set(true);
      this.modalTab.set('general');
      return;
    }

    // valida aviso de descricao vazia (deixa por ultimo pq é confirm de sim/nao)
    if (!this.currentProduct.detalhamentoComplementar) {
      this.confirmTitle.set('Atenção: Descrição Vazia');
      this.confirmMessage.set('A Descrição Complementar está vazia. Isso pode gerar dúvidas na fiscalização.\n\nDeseja salvar mesmo assim?');
      this.showConfirmDialog.set(true);
      return;
    }



    this.processSave();
  }

  processSave() {
    this.currentProduct.situacao = 'ATIVO';
    this.store.addProduct(this.currentProduct); // chama a store pra salvar/atualizar
    this.triggerToast('Produto salvo e publicado!');
    this.showConfirmDialog.set(false);
    this.viewMode.set('list');
  }

  closeAlert() {
    this.showAlertDialog.set(false);
  }

  closeConfirm() {
    this.showConfirmDialog.set(false);
  }

  closeConfirmAndEdit() {
    this.showConfirmDialog.set(false);
    this.modalTab.set('general');
  }

  closeModal() {
    this.viewMode.set('list');
  }

  triggerToast(msg: string) {
    this.toastMessage.set(msg);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
}
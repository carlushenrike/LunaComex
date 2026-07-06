import { CatalogProduct } from '../stores/catalog.store';

export const SiscomexMapper = {

  // formata o produto do banco local pro formato que a api do governo (portal unico) espera
  paraPortalUnico: (produto: CatalogProduct) => {
    
    // remove os pontos do ncm
    const ncmLimpa = produto.ncm.replace(/\./g, '');

    // converte atributos locais pra { atributo, valor } que é o formato da receita
    const listaAtributosAPI = produto.atributos.map(attr => ({
      atributo: attr.codigoAtributo, 
      valor: tratarValor(attr.valor)
    }));

    const payload = {
      denominacao: produto.denominacao,
      // la eles chamam de 'descricao' o que a gente chama de 'detalhamentoComplementar'
      descricao: produto.detalhamentoComplementar || produto.denominacao, 
      modalidade: produto.modalidade,
      ncm: ncmLimpa,
      
      codigosInterno: [ 
        produto.codigo 
      ],

      atributos: listaAtributosAPI,

      // inicializa arrays vazios pra api nao retornar bad request
      atributosMultivalorados: [],
      atributosCompostos: [],
      atributosCompostosMultivalorados: []
    };

    return payload;
  }
};

function tratarValor(valor: any): string {
  if (valor === true || valor === 'true') return "true";
  if (valor === false || valor === 'false') return "false";
  return String(valor || "");
}
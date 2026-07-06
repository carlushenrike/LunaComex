export interface OpcaoDominio {
  codigo: string;
  descricao: string;
}

export interface DetalheAtributo {
  codigo: string;
  nome: string;
  formaPreenchimento: 'TEXTO' | 'DATA' | 'NUMERO' | 'BOOLEANO' | 'LISTA_ESTATICA' | 'LISTA_DINAMICA';
  obrigatorio: boolean;
  tamanhoMaximo?: number;
  orientacaoPreenchimento?: string;
  dominio?: OpcaoDominio[]; // opcoes da combo/select se for lista
  
  valorUsuario?: any; // valor digitado/selecionado pelo usuario no form

  condicionados?: any[];
  codigoPai?: string;      // id do atributo pai pra saber condicional
  valorEsperado?: string;  // valor do pai que ativa esse campo
}

export interface RetornoNcm {
  listaNcm: any[];
  detalhesAtributos: DetalheAtributo[];
}
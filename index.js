import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import "./GenericTable.css"

export const columnGenericTable = props => { }

export default class GenericTable extends Component {

  static defaultProps = {
    options: [],
    overfllowXBody : false,
    withoutHeight : true
  }

  state = {   
    qtPages: 1,
    pageAtual: 1,
    tds: [],
    activeAnimation: false,
    mesAberto: true,
    th: null,

  }

  componentDidMount() {
    const size = Math.ceil(this.props.options.length / 7);
    this.setState({ qtPages: size }, () => this.montaTable());
  }

  componentDidUpdate(oldProps){
    let size = 0;

    if (this.props.options !== oldProps.options) {

      if (this.props.options.length > 0) {
        size = Math.ceil(this.props.options.length / 7);
      }

      this.setState({ qtPages: size }, () => this.montaTable());
    }
  }


  putOrderOnArray = (array)=> {
    let pageItem = 1;
    array.map((o, index) => {
        let numeroItem = index + 1;
        if (numeroItem) {
            let aux = Math.ceil(numeroItem / 7);
            if (aux > pageItem) pageItem++
        }
        o.page = pageItem;
        return o;
    });

    return array;
}

  nextPage = () => {
    this.setState({ activeAnimation: true })
    setTimeout(() => {
      this.setState({ activeAnimation: false });
    }, 500)
    this.montaTable(this.state.pageAtual - 1);
  }


  backPage = () => {
    this.setState({ activeAnimation: true })
    setTimeout(() => {
      this.setState({ activeAnimation: false });
    }, 500)
    this.montaTable(this.state.pageAtual + 1);
  }


  montaTable = (page = 1) => {

    // Tratativa para que não haja pagina inexistente
    if (page > this.state.qtPages) {
      if (this.state.qtPages === 0) {
        this.setState({
          pageAtual: 1
        })
      }
      return;
    }


    let dataFields = [];
    let th = [];
    
    /**
     * Esse talvez seja o método mais complexo. Primeiramente, verica-se  esse props children é um array ou não. O 
     * motivo dessa validacao, se da ao fato de que, quando um componente react tem apenas 1 filho, ele nos tras um 
     * objeto, e não um array. 
     * 
     * Após isso é criado o th baseado no children do children do nosso componente principal. Ou seja, o children
     * do componente principal (GenericTable) é o componente auxiliar (columnGenericTable). No componente
     * columnGenericTable, temos dois pontos importantes 1 -  seu children que é o nome da coluna,
     * 2 - sua props dataField, que é o nome da propriedade json a ser renderezida naquela coluna.
     * 
     * Após isso é criado um for para percorrer os dados (options), e dentro desse for, há outro for para 
     * gerar as TDS, baseado na quantidade de colunas informadas.
     *  
     **/

    if(!this.props.children) {
      throw new Error('Nenhuma coluna definida'); 
    };

    const childrens = this.props.children;
    if(childrens.constructor !== Array){
       if(childrens.type !== "columnGenericTable"){
        throw new Error("O componente filho do componente GenericTable deve ser um columnGenericTable");
       }
    }

    for(let i = 0; i > childrens.length; i ++){
      const o = childrens[i];
      if(o.type !== "columnGenericTable"){
        throw new Error("O componente filho do componente GenericTable deve ser um columnGenericTable");        
      }
    }    
   

    if (this.props.children.constructor === Array) {
      th = this.props.children.map((column, index) => {
        const dataField = column.props.dataField;
        const tdClassName = column.props.tdClassName || "";
        const trClassName = column.props.trClassName || "";
        dataFields.push({dataField : dataField, tdClassName:tdClassName});
        return <th className={`${trClassName}`} key={index}>{column.props.children}</th>
      });
    } else {
      th = <th className={`${this.props.trClassName}`}>{this.props.children}</th>      
      dataFields.push({ dataField : this.props.children.props.dataField, tdClassName : this.props.children.props.className});
    }

    const newArr = this.props.options.map(o => o);
    const arrToMap = this.putOrderOnArray(newArr).filter(o => o.page === page);
    
    let trs = [];
    for (let j = 0; j < arrToMap.length; j++) {
      let auxTd = [];
      
      for (let i = 0; i < dataFields.length; i++) {
        auxTd.push(<td className={`${dataFields[i]['tdClassName']}`} key={i}><p>{arrToMap[j][dataFields[i]['dataField']]}</p></td>)
      }
      trs.push(<tr key={j}>{auxTd}</tr>);
    }

    this.setState({ pageAtual: page, th, tds: trs });
  }



  render() {
    return (
      <>
        <div className={`container-card-dash ${this.props.containerClass}`}>
          <div className={`header-container-dash ${this.props.headerClass}`}>
            <h6>{this.props.title}</h6>
            <div className="tableFooterPonto">
              <Icon name="chevron circle left" disabled={this.state.pageAtual === 1} size="big" id="controlDireitoDash" className="arrowIconList marginLeft" onClick={this.backPage} />
              <Icon name="chevron circle right" disabled={(this.state.pageAtual === this.state.qtPages)} size="big" id="controlEsquerdoDash" className="arrowIconList" onClick={this.nextPage} />
            </div>
          </div>
          <div className={` body-card-dash ${this.props.overfllowXBody ? "rollX" : ""} ${this.props.withoutHeight ? "withoutHeight" : ""}`}>
            <div className="body-to-table-dash">
              <table className="table-dash verbas">
                <thead>
                  <tr>
                    {this.state.th}
                  </tr>
                </thead>
                <tbody className={`${this.state.activeAnimation ? "efectLines" : ""}`}>
                  {this.state.tds}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }
}
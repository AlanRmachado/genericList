# Generic List
Componente para renderizar uma lista genéria baseado em um Array de Objetos Json. Foi feito para uso pessoal em determinado projeto, porém, 
pode servir como idéia ou até mesmo para algum outro caso de uso. Vale lembrar que esse componente tem a dependência do semantic-ui-react, somente por conta dos icones do header.


Exemplo de uso : 

```jsx
<GenericTable options={arrayObjetos} title="" headerClass="" containerClass="">            
     <columnGenericTable dataField="propriedadeJSON" >Nome da Coluna</columnGenericTable>
     <columnGenericTable dataField="propriedadeJSON" >Nome da Coluna</columnGenericTable>
     <columnGenericTable dataField="propriedadeJSON" >Nome da Coluna</columnGenericTable>
</GenericTable>

```

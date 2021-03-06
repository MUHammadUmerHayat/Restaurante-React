import './App.css'
import Cabecalho from './Cabecalho/Cabecalho'
import Rodape from './Rodape/Rodape'
import Card from './Card/Card'
import { useEffect, useState } from 'react'
import { trazerdados } from './api.js'
import Carrinho from './Carrinho/Carrinho'
import PedidosFeitos from './Pedidos/Pedidos'



function App() {
      const [produtos, setProdutos] = useState({})
      const [carregando, setCarregando] = useState(true)
      let [carrinho, setCarrinho] = useState([])
      const [cardClicado, setCardClicado] = useState(false)
      const [pedidosFeitos, setPedidosFeitos] = useState([])


      const link = 'http://localhost:8081'
      

      useEffect( () => {
          console.log('começo')
        
          trazerdados(link, 'restaurante_produtos')
                  .then( (response) => { 
                      setProdutos(response.data)
                      setCarregando(false)
                  })
                  .catch(() => {
                      console.log('Houve erro')
                  })
        
          console.log('fim')
          
      }, [])

      function cardSelecionado() {
          setCardClicado(true)
      }
    
      if (carregando) {
          return (<div >Loading...</div>)
      }

      
      function colocar(item) {
          if (carrinho.every(cada => cada.imagem !== item.imagem)) {
             setCarrinho(cada => [...cada, item])
             setCardClicado(true)
             console.log('********', carrinho)
             console.log('item:->', item)
          }
         
      }

      function alteracoes(operacao, filtro) {
          if (operacao === '+') {
              setCarrinho(carrinho.map(cada => {
                  if (cada.imagem == filtro) {
                      cada = {...cada, quantidade: cada.quantidade += 1, valor: cada.preco * cada.quantidade}
                  }
                  return cada
              }))
          }
          if (operacao === '-') {
              setCarrinho(carrinho.map(cada => {
                  if ((cada.imagem == filtro) && cada.quantidade > 0) {
                      cada = {...cada, quantidade: cada.quantidade -= 1, valor: cada.preco * cada.quantidade}
                  }
                  return cada
              }))
          }
          if (operacao === 'remover') {
              setCarrinho(carrinho.filter(cada => cada.imagem != filtro))
              console.log('aqui ó', carrinho)
          }

      }

      
        
      console.log('---', carrinho)
      console.log('pedidosFeitos: ', pedidosFeitos)


      return (
        <div className="painel--geral">
            <Cabecalho />
            <div className="painel--geral_meio">
                <div className="titulo">Restaurante Panela de Barro</div>
                <div>Comidas</div>
                <div className="grid-container">
                   {produtos.comidas.map((cada) => <Card key={cada.id} id={cada.id}
                                    nome={cada.nome} preco_unidade={cada.preco_unidade}
                                    imagem={cada.imagem_endereco} descricao={cada.descricao} 
                                    resumo_ind={(objeto) => colocar(objeto)}  />)}
                </div>
                <div>Sobremesas</div>
                <div className="grid-container">
                   {produtos.sobremesas.map((cada) => <Card key={cada.id} id={cada.id}
                                    nome={cada.nome} preco_unidade={cada.preco_unidade}
                                    imagem={cada.imagem_endereco} descricao={cada.descricao} 
                                    resumo_ind={(objeto) => colocar(objeto)}  />)}
                </div>
                <div>Bebidas</div>
                <div className="grid-container">
                   {produtos.bebidas.map((cada) => <Card key={cada.id} id={cada.id}
                                    nome={cada.nome} preco_unidade={cada.preco_unidade}
                                    imagem={cada.imagem_endereco} descricao={cada.descricao} 
                                    resumo_ind={(objeto) => colocar(objeto)}  />)}
                </div>
                <Carrinho resumo={carrinho} clicado={cardClicado} funcao={(operacao, quem) => alteracoes(operacao, quem)}
                          pedidofinalizado={(pedido) => setPedidosFeitos([...pedidosFeitos, pedido])} limpar={(valor) => setCarrinho(valor)} />
                <PedidosFeitos feitos={pedidosFeitos} />
            </div>
            <Rodape />
        </div>
      )
}

export default App
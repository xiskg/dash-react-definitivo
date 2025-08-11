import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {CircularProgress} from "@mui/joy";
import CardMoeda from "./Componestes/CardMoeda";
import CardNumero from "./Componestes/CardNumero";
import ContainerLinha from "./Componestes/ContainerLinha";
import CardMarketplace from "./Componestes/CardMarketplace";
import CardPedidos from "./Componestes/CardPedidos";

function Resultados() {
    const [dados, inserirDados] = useState([]);
    const [numeroDePedidosUnicos, setNumeroDePedidosUnicos] = useState(0);
    const [dadosOntem, inserirDadosOntem] = useState(0);
    const [faturamentoDeHoje, setFaturamentoDeHoje] = useState(0);
    const [numeroDePedidosOlist, setNumeroDePedidosOlist] = useState(0);
    const [faturamentoOlist, setFaturamentoOlist] = useState(0);
    const [numeroDePedidosMercadoLivre, setNumeroDePedidosMercadoLivre] = useState(0);
    const [faturamentoMercadoLivre, setFaturamentoMercadoLivre] = useState(0);
    const [numeroDePedidosShopee, setNumeroDePedidosShopee] = useState(0);
    const [faturamentoShopee, setFaturamentoShopee] = useState(0);
    const [numeroDePedidosMagazineLuiza, setNumeroDePedidosMagazineLuiza] = useState(0);
    const [faturamentoMagazineLuiza, setFaturamentoMagazineLuiza] = useState(0);
    const [numeroDePedidosAmazon, setNumeroDePedidosAmazon] = useState(0);
    const [faturamentoAmazon, setFaturamentoAmazon] = useState(0);
    const [numeroDePedidosShein, setNumeroDePedidosShein] = useState(0);
    const [faturamentoShein, setFaturamentoShein] = useState(0);
    const [numeroDePedidosLojasAmericanas, setNumeroDePedidosLojasAmericanas] = useState(0);
    const [faturamentoLojasAmericanas, setFaturamentoLojasAmericanas] = useState(0);
    const [numeroDePedidosLojaIntegrada, setNumeroDePedidosLojaIntegrada] = useState(0);
    const [faturamentoLojaIntegrada, setFaturamentoLojaIntegrada] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const buscarDadosOntem = async () => {
            try {
                const respostaDados = await axios.get('https://zoom-dash-render.onrender.com/api/faturamento_ontem');
                const dados = respostaDados.data;
                const pedidosUnicos = new Set();
                let somaTotal = 0;

                dados.forEach(item => {
                    if (item.POSICAO.trim() !== 'CANCELADO' && !pedidosUnicos.has(item.PEDIDO)) {
                        pedidosUnicos.add(item.PEDIDO);
                        somaTotal += item.TOTAL_PEDIDO;
                    }
                });
                inserirDadosOntem(somaTotal);
            } catch (error) {
                console.error('Erro ao obter os resultados:', error);
            }
        };
        buscarDadosOntem();

        const tempoDeAtualizacao = setInterval(buscarDadosOntem, 5000);
        return () => clearInterval(tempoDeAtualizacao);
    }, []);

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const respostaDados = await axios.get('https://zoom-dash-render.onrender.com/api/resultados');
                const dadosDoBackend = respostaDados.data;
                const dadosFiltrados = dadosDoBackend.filter(dado => dado.POSICAO.trim() !== "CANCELADO");

                // Verificar duplicatas com base no código interno e pegar apenas o primeiro produto
                const pedidosUnicos = new Set();
                const dadosSemDuplicatas = [];
                let somaValoresUnicos = 0;

                dadosFiltrados.forEach(dado => {
                    if (!pedidosUnicos.has(dado.PEDIDO)) {
                        pedidosUnicos.add(dado.PEDIDO);
                        dadosSemDuplicatas.push(dado);
                        somaValoresUnicos += dado.TOTAL_PEDIDO;
                    } else {
                        const existente = dadosSemDuplicatas.find(item => item.COD_INTERNO === dado.COD_INTERNO);
                        if (!existente) {
                            dadosSemDuplicatas.push(dado);
                            somaValoresUnicos += dado.TOTAL_PEDIDO;
                        }
                    }
                });
                // Atualizar estado com os dados filtrados e calculados
                inserirDados(dadosSemDuplicatas);
                setNumeroDePedidosUnicos(pedidosUnicos.size);
                setFaturamentoDeHoje(somaValoresUnicos);
            } catch (error) {
                console.error('Erro ao obter os resultados:', error);
            }
        };

        buscarDados();
// a cada 5s, busca novos dados do banco de dados para preencher
        const tempoDeAtualizacao = setInterval(buscarDados, 5000);
        return () => clearInterval(tempoDeAtualizacao);
    }, []);

    useEffect(() => {
        const dadosSemCancelados = dados.filter(dado => dado.POSICAO.trim() !== "CANCELADO");

        const pedidosUnicos = new Set();
        let somaValoresUnicos = 0;

        dadosSemCancelados.forEach(dado => {
            if (!pedidosUnicos.has(dado.PEDIDO)) {
                pedidosUnicos.add(dado.PEDIDO);
                somaValoresUnicos += dado.TOTAL_PEDIDO;
            }
        });

        // Definir o número de pedidos únicos como o tamanho do conjunto de pedidos únicos
        setNumeroDePedidosUnicos(pedidosUnicos.size);

        // Definir o faturamento total como a soma dos valores únicos
        setFaturamentoDeHoje(somaValoresUnicos);
        const filterAndCalculate = (vendedor) => {
            const filteredData = dados.filter(dado => dado.VENDEDOR.trim() === vendedor && dado.POSICAO.trim() !== "CANCELADO");

            const uniqueOrders = new Set();
            let totalRevenue = 0;

            filteredData.forEach(dado => {
                if (!uniqueOrders.has(dado.PEDIDO)) {
                    uniqueOrders.add(dado.PEDIDO);
                    totalRevenue += dado.TOTAL_PEDIDO;
                }
            });

            return {uniqueOrdersSize: uniqueOrders.size, totalRevenue};
        };

        const olistData = filterAndCalculate('OLIST');
        setNumeroDePedidosOlist(olistData.uniqueOrdersSize);
        setFaturamentoOlist(olistData.totalRevenue);

        const mercadoLivreData = filterAndCalculate('MERCADO LIVRE');
        setNumeroDePedidosMercadoLivre(mercadoLivreData.uniqueOrdersSize);
        setFaturamentoMercadoLivre(mercadoLivreData.totalRevenue);

        const shopeeData = filterAndCalculate('SHOPEE');
        setNumeroDePedidosShopee(shopeeData.uniqueOrdersSize);
        setFaturamentoShopee(shopeeData.totalRevenue);

        const magazineLuizaData = filterAndCalculate('MAGAZINE LUIZA');
        setNumeroDePedidosMagazineLuiza(magazineLuizaData.uniqueOrdersSize);
        setFaturamentoMagazineLuiza(magazineLuizaData.totalRevenue);

        const amazonData = filterAndCalculate('AMAZON');
        setNumeroDePedidosAmazon(amazonData.uniqueOrdersSize);
        setFaturamentoAmazon(amazonData.totalRevenue);

        const sheinData = filterAndCalculate('SHEIN');
        setNumeroDePedidosShein(sheinData.uniqueOrdersSize);
        setFaturamentoShein(sheinData.totalRevenue);

        const lojasAmericanasData = filterAndCalculate('LOJAS AMERICANAS');
        setNumeroDePedidosLojasAmericanas(lojasAmericanasData.uniqueOrdersSize);
        setFaturamentoLojasAmericanas(lojasAmericanasData.totalRevenue);

        const lojaIntegradaData = filterAndCalculate('LOJAS AMERICANAS');
        setNumeroDePedidosLojaIntegrada(lojasAmericanasData.uniqueOrdersSize);
        setFaturamentoLojaIntegrada(lojasAmericanasData.totalRevenue);

    }, [dados]);
    useEffect(() => {
        // Simulando carregamento de dados com um timeout
        setTimeout(() => {
            setIsLoading(false); // Define como falso após 3 segundos
        }, 7000);
    }, []);

    const calcularTaxaFixa = (tarifa, mlcustoadicional, unidade, shein) => {
        switch (tarifa) {
            case 20:
            case 11:
            case 13:
            case 12:
            case 21:
            case 27: // Shoppe
                return 5 * unidade;
            case 1:
            case 25: // Direto ou Shein
                return shein * unidade;
            case 6:
            case 5:
            case 3:
            case 4:
            case 2: // Mercado Livre
                if (mlcustoadicional == 0 || mlcustoadicional == null) {
                    return 0 * unidade;
                } else {
                    return 6.75 * unidade;
                }
            case 9:
            case 19:
            case 10:
            case 24: // Magazine
                return 5;
            case 8:
            case 29: // Olist
                return 5 * unidade;
            default:
                return 0 * unidade;
        }
    };

    function CalcularTarifaDeVenda(origem, total, sku) {
        switch (origem) {
            case 20:
            case 11:
            case 13:
            case 12:
            case 21:
            case 27: // Shoppe
                return (total * 0.20).toFixed(2);
            case 25: // Direto ou Shein
                return (total * 0.16).toFixed(2);
            case 6:
            case 5:
            case 3:
            case 4:
            case 2: // Mercado Livre
                var dado = sku / 100;
                return (total * dado).toFixed(2);
            case 9:
            case 19:
            case 10:
            case 24: // Magazine
                return (total * 0.18).toFixed(2);
            case 8:
            case 29: // Olist
                return (total * 0.19).toFixed(2);
            default:
                return '0.00';
        }
    }

    function CalcularMediaDeValor(faturamento: number, pedidos: number): number {
    if (pedidos === 0) return 0;
    return faturamento / pedidos;
}

    function CalcularCustoProduto(unidade, custo) {
        if (unidade === 0 || custo === 0) {
            return 0;
        }
        return unidade * custo;
    }

    function CalcularFrete(freteReal, FreteComprador, origem, quant) {
        switch (origem) {
            case 20:
            case 11:
            case 13:
            case 12:
            case 21:
            case 27: // Shoppe
                return (0).toFixed(2);
            case 25: // Direto ou Shein
                return (0).toFixed(2);
            case 6:
            case 5:
            case 3:
            case 4:
            case 2: // Mercado Livre
                var valor = freteReal - FreteComprador;
                var valor2 = valor / quant;
                return valor2;
            case 9:
            case 19:
            case 10:
            case 24: // Magazine
                return 0;
            case 8:
            case 29: // Olist
                return (0).toFixed(2);
            default:
                return '0.00';
        }
    }

    function CalcularTotal(valor, taxaFixa, tarifa, custo, frete) {
        return valor - taxaFixa - tarifa - custo - frete;
    }

    function CalcularMargemLucro(total, custoProduto) {
        var margem = total / custoProduto;
        return margem * 100;
    }
    function ContarFull(item){
    let count = 0;
        dados.forEach(item => {
            if (item.FULL === "TRUE") {
                count++;
            }
        });
    return count;
    }
    const QuantFull = ContarFull(dados);
    const performanceDoDia = (((faturamentoDeHoje - dadosOntem) / dadosOntem) * 100);
    const MediaDeValor : number = CalcularMediaDeValor(faturamentoDeHoje, numeroDePedidosUnicos);
    const principal = [
        { titulo: "Faturamento de hoje", faturamento:parseFloat(faturamentoDeHoje), tipo: 'moeda' ,class: 'null'},
        { titulo: "Média de valor - Pedido", faturamento:parseFloat(MediaDeValor) , tipo: 'moeda',class: 'null' },
        { titulo: "Pedidos hoje", faturamento:parseFloat(numeroDePedidosUnicos) , tipo: 'numero' ,class: 'null'},
        { titulo: "Full", faturamento:parseFloat(QuantFull) , tipo: 'numero' ,class: 'full'},
        { titulo: "Performance do dia", faturamento:parseFloat(performanceDoDia), tipo: 'numero' ,class: 'null'},
        { titulo: "Faturamento de ontem", faturamento: parseFloat(dadosOntem), tipo: 'moeda' ,class: 'null'}
    ];
    const marketplace = [
        { url: "https://i.imgur.com/E826ikf.png", quant:parseFloat(numeroDePedidosOlist), faturamento: parseFloat(faturamentoOlist) },
        { url: "https://i.imgur.com/wzxXJk4.png", quant:parseFloat(numeroDePedidosShopee), faturamento: parseFloat(faturamentoShopee) },
        { url: "https://i.imgur.com/Sp2hCNm.png", quant:parseFloat(numeroDePedidosShein), faturamento: parseFloat(faturamentoShein) },
        { url: "https://i.imgur.com/NbyWjPN.png", quant:parseFloat(numeroDePedidosMercadoLivre), faturamento: parseFloat(faturamentoMercadoLivre) },
        { url: "https://i.imgur.com/8Vpu4ns.png", quant:parseFloat(numeroDePedidosMagazineLuiza), faturamento: parseFloat(faturamentoMagazineLuiza) },
        { url: "https://i.imgur.com/hZTn1Ir.png", quant:parseFloat(numeroDePedidosAmazon), faturamento: parseFloat(faturamentoAmazon) },
        { url: "https://i.imgur.com/s5ymHNI.png", quant:parseFloat(numeroDePedidosLojasAmericanas), faturamento: parseFloat(faturamentoLojasAmericanas) },
        { url: "https://i.imgur.com/q1bmMsQ.png", quant:parseFloat(numeroDePedidosLojaIntegrada), faturamento: parseFloat(faturamentoLojasAmericanas) },
    ];
    return (<>
        <div>
            {isLoading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <CircularProgress color="neutral" size="lg" variant="soft"/>
                </div>) : (<div className="container-lg">
                    <div className="principal">
                         <ContainerLinha key="linha-principal">
                            {principal.map((item, index) =>
                                item.tipo === 'moeda' ? (
                                    <CardMoeda key={index} titulo={item.titulo} faturamento={item.faturamento} />
                                ) : (
                                    <CardNumero key={index} titulo={item.titulo} faturamento={item.faturamento} classe={item.class}/>
                                )
                            )}
                        </ContainerLinha>

                        <div className="pedidos">
                            <div className="ultimos-pedidos">
                                {dados.map((item, index) => {
                                    // Calcula os valores uma vez
                                    const taxaFixa = calcularTaxaFixa(item.ORIGEM, item.CUSTO_ADICIONAL, item.QUANT_ITENS, item.CUSTO_FRETE);
                                    const tarifaDeVenda = CalcularTarifaDeVenda(item.ORIGEM, item.TOTAL_PEDIDO, item.COMISSAO_SKU);
                                    const custoProduto = CalcularCustoProduto(item.QUANT_ITENS, item.VLR_CUSTO);
                                    const frete = CalcularFrete(item.VLRFRETE_REAL, item.VLRFRETE_COMPRADOR, item.ORIGEM, item.QUANT_ITENS);
                                    const valorDeVenda =item.TOTAL_PEDIDO;
                                    const total = CalcularTotal(valorDeVenda, taxaFixa, tarifaDeVenda, custoProduto, frete);
                                    const margemLucro = CalcularMargemLucro(total, custoProduto);
                                    return (
                                        <CardPedidos
                                            key={index}
                                            url={item.URL}
                                            titulo={item.TITULO}
                                            quant={item.QUANT_ITENS}
                                            vendedor={item.VENDEDOR}
                                            loja={item.ORIGEM_NOME}
                                            pedido={item.PEDIDO}
                                            integracao={item.INTEGRACAO}
                                            // codInterno={item.COD_INTERNO}
                                            valorDeVenda={valorDeVenda}
                                            taxa={taxaFixa}
                                            tarifa={tarifaDeVenda}
                                            frete={frete}
                                            custo={custoProduto}
                                            total={total}
                                            lucro={margemLucro}
                                            full={item.FULL}
                                            catalogo={item.CATALOGO}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="marketplace">
                        <div className="linha">
                            {marketplace.map((item, index) =>
                                <CardMarketplace url={item.url} quant={item.quant} faturamento={item.faturamento} key={index}/>
                            )}
                        </div>
                    </div>
                </div>)}
        </div>
    </>);
}

export default Resultados;

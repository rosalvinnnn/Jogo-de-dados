import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";

const dados = [
  require("../../assets/1.jpg"),
  require("../../assets/2.jpg"),
  require("../../assets/3.jpg"),
  require("../../assets/4.jpg"),
  require("../../assets/5.jpg"),
  require("../../assets/6.jpg"),
];

type Resultado = {
  rodada: number;
  jogador1: number;
  jogador2: number;
  soma1: number;
  soma2: number;
};

export default function Index() {
  const [rodada, setRodada] = useState(1);
  const [jogadorAtual, setJogadorAtual] = useState(1);
  const [dadosJogador1, setDadosJogador1] = useState([1, 1]);
  const [dadosJogador2, setDadosJogador2] = useState([1, 1]);
  const [jogou1, setJogou1] = useState(false);
  const [jogou2, setJogou2] = useState(false);
  const [vitorias1, setVitorias1] = useState(0);
  const [vitorias2, setVitorias2] = useState(0);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [partidaFinalizada, setPartidaFinalizada] = useState(false);

  const sortearDados = () => [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];

  const soma = (valores: number[]) => valores[0] + valores[1];

  function jogar() {
    if (partidaFinalizada) return;

    if (jogadorAtual === 1 && !jogou1) {
      setDadosJogador1(sortearDados());
      setJogou1(true);
      setJogadorAtual(2);
      return;
    }

    if (jogadorAtual === 2 && jogou1 && !jogou2) {
      const novosDados = sortearDados();
      const soma1 = soma(dadosJogador1);
      const soma2 = soma(novosDados);

      setDadosJogador2(novosDados);
      setJogou2(true);

      let novasVitorias1 = vitorias1;
      let novasVitorias2 = vitorias2;

      if (soma1 > soma2) {
        novasVitorias1 += 1;
        setVitorias1(novasVitorias1);
      } else if (soma2 > soma1) {
        novasVitorias2 += 1;
        setVitorias2(novasVitorias2);
      }

      const novoResultado: Resultado = {
        rodada,
        jogador1: dadosJogador1[0],
        jogador2: novosDados[0],
        soma1,
        soma2,
      };

      setResultados((anteriores) => [
        ...anteriores,
        novoResultado,
      ]);

      setPartidaFinalizada(rodada === 5);
    }
  }

  function proximaRodada() {
    if (rodada >= 5 || !jogou1 || !jogou2) return;

    setRodada((atual) => atual + 1);
    setJogadorAtual(1);
    setJogou1(false);
    setJogou2(false);
    setDadosJogador1([1, 1]);
    setDadosJogador2([1, 1]);
  }

  function reiniciar() {
    setRodada(1);
    setJogadorAtual(1);
    setDadosJogador1([1, 1]);
    setDadosJogador2([1, 1]);
    setJogou1(false);
    setJogou2(false);
    setVitorias1(0);
    setVitorias2(0);
    setResultados([]);
    setPartidaFinalizada(false);
  }

  const vencedor =
    vitorias1 > vitorias2
      ? "Jogador 1 venceu!"
      : vitorias2 > vitorias1
        ? "Jogador 2 venceu!"
        : "A partida terminou empatada!";

  function renderDados(valores: number[]) {
    return (
      <View style={styles.dadosContainer}>
        {valores.map((valor, indice) => (
          <Image
            key={`${indice}-${valor}`}
            source={dados[valor - 1]}
            style={styles.dado}
            resizeMode="contain"
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <StatusBar barStyle="light-content" backgroundColor="#101827" />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>🎲 JOGO DE DADOS</Text>
        <Text style={styles.subtitulo}>
          Dois jogadores • Cinco rodadas
        </Text>

        <View style={styles.placar}>
          <View style={styles.placarItem}>
            <Text style={styles.placarNome}>JOGADOR 1</Text>
            <Text style={styles.placarNumero}>{vitorias1}</Text>
            <Text style={styles.placarLegenda}>Vitórias</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.placarItem}>
            <Text style={styles.placarNome}>JOGADOR 2</Text>
            <Text style={styles.placarNumero}>{vitorias2}</Text>
            <Text style={styles.placarLegenda}>Vitórias</Text>
          </View>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.rodada}>
            {partidaFinalizada ? "PARTIDA FINALIZADA" : `RODADA ${rodada} DE 5`}
          </Text>

          <View style={styles.jogador}>
            <Text style={styles.jogadorTitulo}>Jogador 1</Text>
            {renderDados(dadosJogador1)}
            <Text style={styles.soma}>
              Soma: {jogou1 ? soma(dadosJogador1) : "—"}
            </Text>
            <Text style={styles.estado}>
              {jogou1 ? "Jogada realizada" : "Aguardando jogada"}
            </Text>
          </View>

          <View style={styles.linha} />

          <View style={styles.jogador}>
            <Text style={styles.jogadorTitulo}>Jogador 2</Text>
            {renderDados(dadosJogador2)}
            <Text style={styles.soma}>
              Soma: {jogou2 ? soma(dadosJogador2) : "—"}
            </Text>
            <Text style={styles.estado}>
              {jogou2 ? "Jogada realizada" : "Aguardando jogada"}
            </Text>
          </View>

          {!partidaFinalizada && (
            <Pressable
              style={[
                styles.botao,
                (jogadorAtual === 1 && jogou1) ||
                (jogadorAtual === 2 && jogou2)
                  ? styles.botaoDesativado
                  : null,
              ]}
              onPress={jogar}
              disabled={
                (jogadorAtual === 1 && jogou1) ||
                (jogadorAtual === 2 && jogou2)
              }
            >
              <Text style={styles.botaoTexto}>
                {jogadorAtual === 1
                  ? "JOGAR DADOS — JOGADOR 1"
                  : "JOGAR DADOS — JOGADOR 2"}
              </Text>
            </Pressable>
          )}

          {jogou1 && jogou2 && !partidaFinalizada && (
            <Pressable
              style={styles.botaoSecundario}
              onPress={proximaRodada}
            >
              <Text style={styles.botaoTexto}>
                PRÓXIMA RODADA
              </Text>
            </Pressable>
          )}

          {partidaFinalizada && (
            <View style={styles.resultadoFinal}>
              <Text style={styles.resultadoTitulo}>
                🏆 RESULTADO FINAL
              </Text>
              <Text style={styles.vencedor}>{vencedor}</Text>
              <Text style={styles.resultadoDescricao}>
                Jogador 1: {vitorias1} vitória(s){"\n"}
                Jogador 2: {vitorias2} vitória(s)
              </Text>

              <Pressable style={styles.botao} onPress={reiniciar}>
                <Text style={styles.botaoTexto}>
                  JOGAR NOVAMENTE
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.historico}>
          <Text style={styles.historicoTitulo}>
            HISTÓRICO DAS RODADAS
          </Text>

          {resultados.length === 0 ? (
            <Text style={styles.semHistorico}>
              As rodadas aparecerão aqui.
            </Text>
          ) : (
            resultados.map((resultado) => (
              <View
                key={resultado.rodada}
                style={styles.historicoItem}
              >
                <Text style={styles.historicoTexto}>
                  Rodada {resultado.rodada}
                </Text>
                <Text style={styles.historicoTexto}>
                  J1: {resultado.soma1} × J2: {resultado.soma2}
                </Text>
                <Text style={styles.historicoDetalhe}>
                  {resultado.soma1 > resultado.soma2
                    ? "Vitória do Jogador 1"
                    : resultado.soma2 > resultado.soma1
                      ? "Vitória do Jogador 2"
                      : "Empate na rodada"}
                </Text>
              </View>
            ))
          )}
        </View>

        {partidaFinalizada && (
          <Pressable
            style={styles.botaoReiniciar}
            onPress={reiniciar}
          >
            <Text style={styles.botaoTexto}>
              REINICIAR PARTIDA
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#101827",
  },
  conteudo: {
    padding: 20,
    paddingTop: 45,
    paddingBottom: 40,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitulo: {
    color: "#AAB5C5",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },
  placar: {
    flexDirection: "row",
    backgroundColor: "#1D293B",
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
    alignItems: "center",
    justifyContent: "space-around",
  },
  placarItem: {
    alignItems: "center",
    flex: 1,
  },
  placarNome: {
    color: "#AAB5C5",
    fontSize: 12,
    fontWeight: "bold",
  },
  placarNumero: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    marginVertical: 5,
  },
  placarLegenda: {
    color: "#AAB5C5",
    fontSize: 12,
  },
  divisor: {
    width: 1,
    height: 65,
    backgroundColor: "#40506A",
  },
  cartao: {
    backgroundColor: "#1D293B",
    padding: 18,
    borderRadius: 18,
  },
  rodada: {
    color: "#F5C451",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 20,
  },
  jogador: {
    alignItems: "center",
    paddingVertical: 8,
  },
  jogadorTitulo: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dadosContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  dado: {
    width: 75,
    height: 75,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  soma: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
  },
  estado: {
    color: "#AAB5C5",
    fontSize: 12,
    marginTop: 5,
  },
  linha: {
    height: 1,
    backgroundColor: "#40506A",
    marginVertical: 15,
  },
  botao: {
    backgroundColor: "#F5C451",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  botaoDesativado: {
    opacity: 0.5,
  },
  botaoSecundario: {
    backgroundColor: "#3378E8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  botaoTexto: {
    color: "#101827",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
  resultadoFinal: {
    marginTop: 25,
    padding: 18,
    backgroundColor: "#26364C",
    borderRadius: 12,
    alignItems: "center",
  },
  resultadoTitulo: {
    color: "#F5C451",
    fontSize: 18,
    fontWeight: "bold",
  },
  vencedor: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
  },
  resultadoDescricao: {
    color: "#D4DCE8",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 12,
  },
  historico: {
    marginTop: 24,
    backgroundColor: "#1D293B",
    borderRadius: 18,
    padding: 18,
  },
  historicoTitulo: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 15,
  },
  semHistorico: {
    color: "#AAB5C5",
  },
  historicoItem: {
    borderTopWidth: 1,
    borderTopColor: "#40506A",
    paddingVertical: 12,
  },
  historicoTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 4,
  },
  historicoDetalhe: {
    color: "#AAB5C5",
    fontSize: 12,
  },
  botaoReiniciar: {
    backgroundColor: "#F5C451",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
});
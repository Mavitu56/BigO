import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Result() {
  const router = useRouter();
  const { value } = useLocalSearchParams();

  const parsedValue = typeof value === "string" ? JSON.parse(value) : value;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complexidade Identificada:</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {typeof parsedValue?.complexity === "string"
            ? parsedValue.complexity
            : parsedValue?.complexity?.bigO || "O(?)"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Explicação:</Text>
      <Text style={styles.paragraph}>
        {typeof parsedValue?.explanation === "string"
          ? parsedValue.explanation
          : typeof parsedValue?.complexity?.explanation === "string"
            ? parsedValue.complexity.explanation
            : JSON.stringify(parsedValue?.explanation) ||
            "Não foi possível gerar explicação para a complexidade."}
      </Text>

      <Text style={styles.sectionTitle}>Sugestão:</Text>
      <Text style={styles.paragraph}>
        {typeof parsedValue?.complexity?.improvement === "string"
          ? parsedValue.complexity.improvement
          : JSON.stringify(parsedValue?.improvement) ||
          "Nenhuma sugestão foi fornecida pelo servidor."}
      </Text>

      <Text style={styles.sectionTitle}>Complexidade melhorada:</Text>
      <Text style={styles.paragraph}>
        {typeof parsedValue?.complexity?.improved_big_o === "string"
          ? parsedValue.complexity.improved_big_o
          : JSON.stringify(parsedValue?.improved_big_o) ||
          "Nenhuma sugestão foi fornecida pelo servidor."}
      </Text>

      {parsedValue?.suggested_code && (
        <View style={styles.codeBox}>
          <Text style={styles.code}>
            {parsedValue.suggested_code.trim()}
          </Text>
        </View>
      )}

      <Text style={styles.performanceText}>
        Quer ver a comparação de performance?
      </Text>
      <TouchableOpacity
        style={styles.buttonOutlinePurple}
        onPress={() =>
          router.push({
            pathname: "/complexity-graph",
            params: {
              value: value,
              current: parsedValue?.complexity?.bigO,
              new: parsedValue?.complexity?.improved_big_o,
            },
          })
        }
      >
        <Text style={styles.buttonOutlinePurpleText}>
          Ver gráfico de complexidade
        </Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.buttonFilled} onPress={() => router.push("/")}>
        <Text style={styles.buttonFilledText}>Fazer outra Análise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6a0dad",
    alignSelf: "flex-start",
    marginBottom: 4,
    marginTop: 80,
  },
  badge: {
    backgroundColor: "#e6d6fa",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4b0082",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#6a0dad",
    alignSelf: "flex-start",
    marginBottom: 6,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  codeBox: {
    backgroundColor: "#2e2e2e",
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    alignSelf: "stretch",
  },
  code: {
    fontFamily: "Courier New",
    color: "#f8f8f2",
    fontSize: 14,
    lineHeight: 20,
  },
  footerText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#9762F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#9762F6",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonFilled: {
    backgroundColor: "#9762F6",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonFilledText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  performanceText: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  buttonOutlinePurple: {
    borderWidth: 2,
    borderColor: "#6a0dad",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonOutlinePurpleText: {
    color: "#6a0dad",
    fontWeight: "bold",
    fontSize: 16,
  },
});

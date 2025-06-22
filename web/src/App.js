import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { linkBridge } from "@webview-bridge/web";

// Adicionado: Log para confirmar que o script está carregando
console.log("App.js script loaded in WebView.");

// --- Funções e constantes de dados ---
const generateData = () => {
  const data = [];
  for (let i = 1; i <= 100; i += 1) {
    data.push({
      n: i,
      O1: 1,
      Ologn: Math.log2(i),
      On: i,
      Onlogn: i * Math.log2(i),
      On2: i * i
    });
  }
  return data;
};

const complexityKeys = {
  O1: "O(1)",
  Ologn: "O(log n)",
  On: "O(n)",
  Onlogn: "O(n log n)",
  On2: "O(n^2)" // Corrigido para consistência
};

// ADICIONADO: Um mapa reverso para traduzir os valores recebidos para as chaves internas.
const complexityKeyMap = {
  "O(1)": "O1",
  "O(log n)": "Ologn",
  "O(n)": "On",
  "O(n log n)": "Onlogn",
  "O(n^2)": "On2" // CORRIGIDO: de "O(n²)" para "O(n^2)" para corresponder aos dados recebidos
};

const colors = {
  O1: "#7c3aed",
  Ologn: "#10b981",
  On: "#3b82f6",
  Onlogn: "#f59e0b",
  On2: "#ef4444"
};

// --- Configuração da Bridge ---
const bridge = linkBridge();

// --- Componente Principal ---
export default function App() {
  const [config, setConfig] = useState({});
  const data = generateData();

  useEffect(() => {
    // Adicionado: Log para confirmar que o useEffect está sendo executado.
    console.log("useEffect running, setting up event listener...");

    const unsubscribe = bridge.addEventListener(
      "sendComplexityParams",
      (params) => {
        console.log("EVENTO 'sendComplexityParams' RECEBIDO!", params);
        
        // ALTERADO: Use o mapa para obter as chaves corretas antes de definir o estado.
        const currentKey = complexityKeyMap[params.current];
        const newKey = complexityKeyMap[params.new];

        console.log(`Mapeado: current='${params.current}' para '${currentKey}', new='${params.new}' para '${newKey}'`);

        if (currentKey && newKey) {
          setConfig({
            current: currentKey,
            new: newKey,
          });
        }
      }
    );
    
    return unsubscribe;
  }, []);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#fff",
        color: "#111",
        padding: "16px",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "12px"
        }}
      >
        Big-O Complexity Chart
      </h2>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              dataKey="n"
              tick={{ fontSize: 10 }}
              label={{
                value: "Quantidade de elementos (n)",
                position: "insideBottom",
                offset: -8,
                fontSize: 12
              }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              label={{
                value: "Operações estimadas",
                angle: -90,
                position: "insideLeft",
                fontSize: 12
              }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9fafb", borderColor: "#d1d5db" }}
              labelStyle={{ fontWeight: "bold" }}
            />
            {Object.keys(complexityKeys).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={complexityKeys[key]}
                // A lógica aqui agora funcionará porque 'config' armazena as chaves corretas (ex: "On2")
                strokeWidth={key === config.current || key === config.new ? 3.5 : 1.5}
                strokeDasharray={key === config.new ? "5 5" : ""}
                dot={false}
                stroke={colors[key]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "12px", fontSize: "14px" }}>
        {Object.keys(complexityKeys).map((key) => (
          <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: colors[key],
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <span>
              {complexityKeys[key]}
              {key === config.current && (
                <strong style={{ marginLeft: 6 }}>(Complexidade Atual)</strong>
              )}
              {key === config.new && (
                <strong style={{ marginLeft: 6 }}>(Complexidade Nova)</strong>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { mistral } from "./lib/mistral";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: string | null; content: string }>
  >([]);

  async function getChatBotResponse(message: string) {
    const response = await mistral(message);
    const contentRaw = response.choices[0]?.message?.content;
    const content = Array.isArray(contentRaw)
      ? contentRaw
          .map((c) => {
            if (typeof c === "string") return c;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyC = c as any;
            if (typeof anyC.text === "string") return anyC.text;
            if (typeof anyC.content === "string") return anyC.content;
            return "";
          })
          .join("")
      : typeof contentRaw === "string"
      ? contentRaw
      : "";
    const role = response.choices[0]?.message?.role;
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: role || "assistant", content: content || "" },
    ]);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (input.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input.trim() },
    ]);
    getChatBotResponse(input.trim());
    setInput("");
  }
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50">
      <main className="grow flex justify-center items-center p-4 w-full">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 animate-fade-in">
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 animate-bounce-in">
              Selamat Datang di Chatbot AI
            </h2>
            <p className="text-sm md:text-base animate-slide-up">
              Mulai ajukan pertanyaan Anda di bawah ini.
            </p>
            <p className="text-sm animate-slide-up delay-100">
              Create By @bangong_78
            </p>
            <p className="text-sm animate-slide-up delay-200">
              {" "}
              Model AI: Mistral Small{" "}
            </p>
          </div>
        )}
        <div className="flex flex-col grow justify-between ">
          {messages.map((msg, index) => [
            <div key={index} className="animate-slide-up mb-3">
              <p className={msg.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={
                    msg.role === "user"
                      ? "inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-2xl max-w-xs shadow-md hover:shadow-lg transition-all duration-300"
                      : "inline-block bg-white text-gray-800 p-3 rounded-2xl max-w-xs shadow-md hover:shadow-lg transition-all duration-300"
                  }
                >
                  {msg.content}
                </span>
              </p>
            </div>,
          ])}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full px-4 md:px-20 py-4 bg-white/70 backdrop-blur-md shadow-sm">
        <div>
          <form
            className="flex justify-center items-center "
            onSubmit={handleSubmit}
          >
            <Input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Mau Bertanya Apa Hari Ini"
              className="grow h-12 rounded-r-none text-sm md:text-base focus:outline-none focus:ring-0"
            />
            <Button
              type="submit"
              className="h-12 px-4 md:px-6 rounded-l-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Kirim
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}

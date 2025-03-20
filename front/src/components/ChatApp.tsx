"use client";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { useState } from "react";

function Users() {
  const form2 = useForm();
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);

  const postLogin = async () => {
    const newMessage = form2.getValues("msg");
    const newMessageObject = { role: "user", parts: [{ text: newMessage }] };

    const updatedChatHistory = [...chatHistory, newMessageObject]; // 形式を統一

    setChatHistory(updatedChatHistory);

    const sendData = {
      chatHistory: updatedChatHistory,
      msg:form2.getValues("msg"),
    };

    try {
      const response = await fetch("http://localhost:8788/chat", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          sendData,
        ),
      });
      const result = await response.json();
      console.log("sendData", sendData);

      if (response.ok) {
        localStorage.setItem("token", result.token);
        console.log("ログイン成功", result);
      } else {
        console.log("ログイン失敗", result);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //chatHistory, msg

  const defaultValues = [
    { label: "チャット履歴", fieldName: "chatHistory", id: "chatHistory" },
    { label: "メッセージ", fieldName: "msg", id: "msg" },
  ];

  return (
    <div className="App">
      <form onSubmit={form2.handleSubmit(postLogin)}>
        {defaultValues.map((value) => (
          <Input
            key={value.id}
            label={value.label}
            fieldName={value.fieldName}
            id={value.id}
            register={form2.register}
          />
        ))}
        <div>
          <button type="submit">サインイン</button>
        </div>
      </form>
    </div>
  );
}

export default Users;

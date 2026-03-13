const run = async () => {
  try {
    const res = await fetch("http://localhost:5173/api/enhance", { // Vercel dev typically runs on 3000
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt: "Hello world", isRegeneration: false })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (err) {
    console.error(err);
  }
};
run();

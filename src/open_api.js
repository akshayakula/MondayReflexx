import keys from './.key.json';
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

export const getGPT = async (chat, loadingSetter) => {
  const url = API_ENDPOINT
  let r;
  loadingSetter(true)
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": chat,
    "temperature": 1
  }
  try{
    r = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.openai}`},
      body: JSON.stringify(data)
    })
    r = await r.json()
    console.log(r)
    loadingSetter(false)
    return r.choices[0].message.content
  }
  catch(e){
    loadingSetter(false)
    console.log(e)
  }
}
import axios from 'axios';
import { Base64 } from 'base64-string';

export const getFileContents = async (token, user, repo, file_path, loadSetter) => {
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${file_path}`
  loadSetter(true)
  let r;
  try{
    r = await fetch(url,{
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
    r = await r.json()
    let data = r.content
    r = data
  }
  catch(e){
    r = e
  }
  finally{
    loadSetter(false)
    return r
  }
}
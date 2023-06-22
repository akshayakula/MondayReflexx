import React, { useState, useEffect, useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import mondaySdk from "monday-sdk-js";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MonacoEditor from 'react-monaco-editor';
import { getAll } from "./queries";
import { getFileContents } from "./github-api";
import { getGPT } from "./open_api";
import Sphere from './Sphere.js';

import './sphere.css';
const monday = mondaySdk();

const defaultChat = [{"role": "system", "content": "You are a kid."}, {"role": "user", "content": "tell me a joke!"}]

const getChat = (prompt,code) => {
  return [{"role": "system", "content": "You are a software developer"}, {"role": "user", "content": `${prompt}\n${code}`}]
}

function App() {
  const [context, setContext] = useState();
  const [settings, setSettings] = useState();
  const [boardData, setBoardData] = useState([]);
  const [fileContents, setFileContents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState('');
  const [cause, setCause] = useState('');
  const [result, setResult] = useState('');

  let relevantFilePath = '';

  if(task.column_values){
    task.column_values.forEach(e => {
      if(e.title === "Relevant File Path"){
        relevantFilePath = e.value.slice(1,-1)
      }
    })
  }


  const handleChange = (event) => {
    setTask(event.target.value);
  };

  // let decodedText = '';

  const handleAnalyzeTask = async (event) => {
    event.preventDefault();
    // setFileContents("loading...")
    let contents = await getFileContents(settings.gh_token, settings.owner, settings.repo, relevantFilePath, setLoading)
    contents = atob(contents)
    setFileContents(contents)
    // decodedText = Buffer.from(fileContents, 'base64').toString()
  }

  const handleGPTCause = async (event) => {
    event.preventDefault();

    const baseChat = getChat(`Given that the Link to 'Contact' page doesn't work and the relevant file what is the likely buggy portion of code`, fileContents)

    setCause(await getGPT(baseChat, setLoading))
  }

  const handleGPTFix = async (event) => {
    event.preventDefault();

    const baseChat = getChat(`Given that ${cause} can you fix the file`, fileContents)

    setResult(await getGPT(baseChat, setLoading))
  }


  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    monday.listen("settings", (res) => {
      setSettings(res.data);
    })

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
      if (res.data.boardIds.length > 0) {
        fetchBoardData(res.data.boardIds[0])
      }
    });
  }, []);

  let fetchBoardData = async (boardId) => {
    monday.api(getAll(boardId)).then( res => {
      setBoardData(res.data.boards[0].items)
    })
  }

  let boardArray = []
  boardData.forEach(e => { boardArray.push({label: e.name, ...e}) })

  return (
    <div className="App">
      <header className="App-header">
      { loading ? <>
      <div style={{height:"150px"}}>
        <Sphere/>
      </div>
      <div>Thinking</div>
      </> : <>
      <Stack>
          {cause ? <>


          {/* <div>{relevantFilePath}</div> */}
          {/* <div>{JSON.stringify(settings)}</div> */}
          {/* {JSON.stringify(fileContents)} */}
          <div>{cause}</div>
          <Button onClick={ e => handleGPTFix(e)}>Get AI Fix</Button>
          <br></br>

          <Stack direction="row">
            <div className='Code-block'>{result && <MonacoEditor
                width="800"
                height="600"
                language="html"
                value={result}
                options={{
                  theme: 'vs-dark'
                }}
              />}</div>
            <div className='Code-block'>{fileContents && <MonacoEditor
                width="800"
                height="600"
                language="html"
                value={fileContents}
                options={{
                  theme: 'vs-dark'
                }}
              />
            }
            </div>
          </Stack>
          </>
          :
          <>
          <div styles={{margin: "50px"}}>Choose a Task</div>
            <div><Autocomplete
            disablePortal
            id="combo-box-demo"
            options={boardArray}
            sx={{ width: "75vw" }}
            onChange={(event, value) => setTask(value)}
            renderInput={(params) => <TextField {...params} label="Tasks" />}
            /></div>
          {/* {boardData.map(e => <div>{e.name}</div>)} */}
          {relevantFilePath.length > 0 && <Button onClick={ e => handleAnalyzeTask(e)}>Pull Task Relevant Code</Button>}
          {fileContents && <Button onClick={ e => handleGPTCause(e)}>Get AI Cause Analysis</Button>}
          {fileContents && <MonacoEditor
                width="800"
                height="600"
                language="html"
                value={fileContents}
                options={{
                  theme: 'vs-dark'
                }}
              />
            }
          </>
          }
          </Stack>
      </>}

      </header>
      <div>

      </div>

    </div>
  );
}

export default App;

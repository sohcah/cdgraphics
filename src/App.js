import React from 'react';
import './App.css';
import Whiteley from './whiteley.png';
import Nick from './nick.png';
import RachelNormal from './RachelNormal.png';
import RachelGold from './RachelGold.png';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

function screenshot(i, date) {
  console.log(i, date);
  domtoimage.toBlob(document.getElementById('image' + i), {
    width: 800,
    height: 600
  })
    .then(function (blob) {
      window.saveAs(blob, date.replace(/\//g, '-') + '-' + i + '.png');
    })
    .catch(function (error) {
      alert(error);
      console.error('oops, something went wrong!', error);
    });
}

function generateLetterTiles(letters, solution, x, y) {
  if (!solution) {
    return {
      top: letters.split(''),
      bottom: [],
      type: "letters",
      ...x
    }
  } else {
    var top = letters.split('');
    var bottom = solution.split('');
    if (!y) {
      for (var letter of bottom) {
        top = [...top.slice(0, top.indexOf(letter)), null, ...top.slice(top.indexOf(letter) + 1)]
      }
    }
    return {
      top,
      bottom,
      type: "letters",
      ...x,
      gold: !bottom.find(i => !i) && bottom.length >= 9
    }
  }
}

function generate(i) {
  if (i.type == "numbers") {
    return {};
  } else {
    console.log(i.top)
    return generateLetterTiles(i.top, i.bottom, { gold: !i.top.find(i => i) });
  }
}

function App() {
  var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var [ttt, setTTT] = React.useState("");
  var [showTop, setShowTop] = React.useState(false);
  var [useWhiteley, setUseWhiteley] = React.useState(false);
  var [newFont, setNewFont] = React.useState(false);
  var [letters, setLetters] = React.useState("");
  var [solutions, setSolutions] = React.useState([""]);
  var [l1, setL1] = React.useState("");
  var [l2, setL2] = React.useState("");
  var [l3, setL3] = React.useState("");
  var [l4, setL4] = React.useState("");
  var [date, setDate] = React.useState("");
  var [importText, setImport] = React.useState("");
  function setSolution(index, value) {
    var x = solutions.slice();
    x[index] = value.toUpperCase();
    setSolutions(x);
  }
  var [rachel, setRachel] = React.useState(true);
  React.useEffect(() => {
    var data = JSON.parse(localStorage.data || "{}");
    setTTT(data.ttt || "");
    setLetters(data.letters || "");
    setSolutions(data.solutions || [])
    setL1(data.l1 || "")
    setL2(data.l2 || "")
    setL3(data.l3 || "")
    setL4(data.l4 || "")
    setDate(data.date || "");
    setRachel(data.rachel === undefined ? true : data.rachel);
    setShowTop(data.showTop === undefined ? false : data.showTop);
    setUseWhiteley(data.useWhiteley === undefined ? false : data.useWhiteley);
  }, [])
  function clear() {
    setTTT("");
    setLetters("");
    setSolutions([""])
    setL1("")
    setL2("")
    setL3("")
    setL4("")
    setDate("");
    setRachel(true);
    setShowTop(false);
    setNewFont(false);
    setUseWhiteley(false);
  }
  React.useEffect(() => {
    localStorage.data = JSON.stringify({ letters, solutions, l1, l2, l3, l4, date, rachel, ttt, showTop, useWhiteley });
  }, [letters, solutions.join(','), l1, l2, l3, l4, date, rachel, ttt, showTop, useWhiteley])
  // return (
  //   [[654,100,50,2,4,5,6]].map((l,gold)=><div className={gold?"image gold":"image"}>
  //     <div className="board" style={{width:600,height:400,padding:20,display:"flex",flexDirection:"column",justifyContent: "stretch"}}>
  //       <div style={{paddingLeft:220,paddingRight:220}}>
  //         <div className="rowWrapper">
  //           <div className="row">
  //             <div className="card full">{l[0]}</div>
  //           </div>
  //         </div>
  //       </div>
  //       <div style={{paddingLeft:40,paddingRight:40,paddingTop:10}}>
  //         <div className="rowWrapper">
  //           <div className="row">
  //             {l.slice(1).map(i=><div className={"card full n" + i}>{i}</div>)}
  //           </div>
  //         </div>
  //       </div>
  //       <div className="numberGrid" style={{fontFamily: "'Sriracha'",margin:-10,marginTop:10,flex:1,whiteSpace:"pre",padding:10,fontSize:"1.8em",lineHeight:1}}>
  //         100 x 6 = 600<br/>
  //         600 + 50 + 4 = <strong><u>654</u></strong>
  //       </div>
  //     </div>
  //     <img className={gold?"rachelgold":"rachel"} src={gold?RachelGold:RachelNormal} />
  //   </div>)
  // );

  function runImport() {
    let t = importText.split('\n').map(i=>i.split('-'));
    var titles = ``;
    var solutions = [];
    for(var [k,i] of t) {
      switch (k.toUpperCase()) {
        case 'L':
          setLetters(i);
          break;
        case 'S':
          solutions.push(i);
          break;
        case 'T':
          titles+=`\n${i}`;
          break;
        case 'X':
        case 'TTT':
          setTTT(i);
          break;
        case 'D':
          setDate(i);
          break;
        case 'R':
          setRachel(true);
          if(i.toUpperCase()==="FALSE") setRachel(false);
          break;
        case 'K':
          setShowTop(false);
          if(i.toUpperCase()==="TRUE") setShowTop(true);
          break;
        case '_WHITELEY':
          console.log(i);
          setUseWhiteley(false);
          if(i.toUpperCase()==="TRUE") setUseWhiteley(true);
          break;
        case 'F':
          setNewFont(true);
          if(i.toUpperCase()==="FALSE") setNewFont(true);
          break;
      }
    }
    setSolutions(solutions);
    if(titles) {
      setL4(titles.split('\n').reverse()[0])
      setL3(titles.split('\n').reverse()[1])
      setL2(titles.split('\n').reverse()[2])
      setL1(titles.split('\n').reverse()[3])
    }
  }

  return <div>
    <div style={{ padding: 4 }}>
      <div>Original design by <a href="https://www.facebook.com/100009965523845">Chloe Jones</a> for the <a href="https://www.facebook.com/groups/countdowners/">Countdowners Facebook group</a></div>
      <div>Generator developed by <a href="https://sohcah.dev">sohcah</a>, and open-sourced on <a href="https://github.com/sohcah/cdgraphics">GitHub</a></div>
      <button style={{ marginTop: 4 }} onClick={clear} style={{ fontSize: 20, backgroundColor: "#ffaaaa" }}>CLEAR</button>
    </div>
    <div style={{ padding: 4 }}>
      <div>Import from Data (<span onClick={()=>setImport(`#- Comments start with #- and are ignored
#- Letter Selection
L-DOWNCOUNT
#- Solutions - You can put any number of solutions
S-COUNTDOWN
S-COUNT
#- Titles - You can put anywhere between 0 and 4 T- lines, and you can use Empty Lines too. [Optional]
T-Line1
T-Line2
T-Line3
T-Line4
#- TTT Text - Can also start with TTT- [Optional]
X-This is a teaser text
#- Date [Optional]
D-25/12/2020
#- Show Nick/Rachel [Optional]
R-TRUE
#- Keep Top Letters [Optional]
K-FALSE`)} style={{color:"blue"}}>Click for Example</span>)</div>
      <textarea style={{minHeight:100,minWidth:400}} value={importText} onChange={(ev) => setImport(ev.target.value)} /><br/>
      <button style={{ marginTop: 4 }} onClick={() => runImport()}>Import</button>
    </div>
    <div style={{ padding: 4 }}>
      <div>Letters</div>
      <input value={letters} onChange={(ev) => setLetters(ev.target.value.toUpperCase())} />
    </div>
    <div style={{ padding: 4 }}>
      <div>Solutions</div>
      {Object.keys(solutions).map(i => <><input style={{ marginTop: i !== "0" ? 4 : 0 }} placeholder={`Solution ${Number(i) + 1}`} value={solutions[i]} onChange={(ev) => setSolution(i, ev.target.value)} /><br /></>)}
      <button style={{ marginTop: 4 }} onClick={() => setSolutions([...solutions, ""])}>Add</button>
    </div>



    <div style={{ padding: 4 }}>
      <div>Titles (Optional)</div>
      <input placeholder="Line 1" value={l1} onChange={(ev) => setL1(ev.target.value)} /><br />
      <input style={{ marginTop: 4 }} placeholder="Line 2" value={l2} onChange={(ev) => setL2(ev.target.value)} /><br />
      <input style={{ marginTop: 4 }} placeholder="Line 3" value={l3} onChange={(ev) => setL3(ev.target.value)} /><br />
      <input style={{ marginTop: 4 }} placeholder="Line 4" value={l4} onChange={(ev) => setL4(ev.target.value)} /><br />
    </div>
    <div style={{ padding: 4 }}>
      <div>Teaser Text (Optional, enabled TTT Mode) <b style={{ backgroundColor: "limegreen", padding: 4, borderRadius: 8 }}>NEW!</b></div>
      <input style={{ width: "100%" }} placeholder="TTT Text" value={ttt} onChange={(ev) => setTTT(ev.target.value)} />
    </div>
    <div style={{ padding: 4 }}>
      <div>Date (Optional)</div>
      <input placeholder="Date" value={date} onChange={(ev) => setDate(ev.target.value)} />
    </div>
    <div style={{ padding: 4 }}>
      Rachel/Nick <input type="checkbox" checked={rachel} onChange={(ev) => setRachel(ev.target.checked)} />
    </div>
    {/* {ttt&&<div style={{ padding: 4 }}>
      Whiteley <input type="checkbox" checked={useWhiteley} onChange={(ev) => setUseWhiteley(ev.target.checked)} />
    </div>} */}
    <div style={{ padding: 4 }}>
      Keep Top Letters <input type="checkbox" checked={showTop} onChange={(ev) => setShowTop(ev.target.checked)} /> <b style={{ backgroundColor: "limegreen", padding: 4, borderRadius: 8 }}>NEW!</b>
    </div>
    {/* <div style={{ padding: 4 }}>
      Use Experimental Font <input type="checkbox" checked={newFont} onChange={(ev) => setNewFont(ev.target.checked)} /> <b style={{ backgroundColor: "limegreen", padding: 4, borderRadius: 8 }}>NEW!</b>
    </div> */}
    <div style={{ padding: 4 }}>
      <div>Click an image to save</div>
    </div>
    {(
      ["", ...solutions].map((i, index) => generateLetterTiles(letters.toUpperCase(), i, { gold: false, index }, showTop)).map(({ top, bottom, gold, index }) => <div className={ttt ? "ttt" : ""} id={`image${index == 0 ? 'M' : `S${index}`}`}><div onClick={() => screenshot(index == 0 ? 'M' : `S${index}`, date)} className={gold ? "image gold" : "image"}>
        <div className="board" style={{ width: 600, height: 250, padding: 20, display: "flex", flexDirection: "column", justifyContent: "stretch" }}>

          {ttt && <>
            <div className="row" style={{ flex: 1, marginTop: -20, justifyContent: "center", alignItems: "center", color: "white", fontSize: 20, textAlign: "center" }}>
              {ttt}
            </div>
          </>}
          <div className="rowWrapper">
            <div className="row">
              {arr.map(i => <div className={`card ${top[i] && "full"}`}>{top[i] || ""}</div>)}
            </div>
            <div className="row">
              {arr.map(i => <div className={`card ${bottom[i] && "full"}`}>{bottom[i] || ""}</div>)}
            </div>
          </div>
          {!ttt && <>
            <div style={{ flex: 1 }}></div>
            <div className="row">
              <div className="selectionBox">
                VOWEL
              </div>
              <div style={{ flex: 2 }}></div>
              <div className="selectionBox">
                CONSONANT
              </div>
            </div>
          </>}
        </div>
        <div style={{ position: "absolute", top: 8, right: 8, fontSize: 14, maxWidth: 300, color: "black" }}>
          Generated by cdgraphics.sohcah.dev
        </div>
        <div style={{ position: "absolute", top: 0, left: 190, textAlign: "center", fontSize: 48, width: 200, color: !gold ? "#c9a779" : "white" }}>
          {ttt?'Teaser':'Letters'}
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 20, maxWidth: 200, color: "white" }}>
          {date}
        </div>
        <div style={{ position: "absolute", bottom: ttt ? 100 : 16, left: ttt ? 300 : 400, fontSize: 24, maxWidth: 300, color: !gold ? "#c9a779" : "white" }}>
          {l1}<br />
          {l2}<br />
          {l3}<br />
          <div style={l4 ? {} : { opacity: 0 }}>{l4 || "_"}</div>
        </div>
        {rachel && <img className={ttt ? (useWhiteley ? "whiteley" : "nick") : (gold ? "rachelgold" : "rachel")} src={ttt ? (useWhiteley ? Whiteley : Nick) : (gold ? RachelGold : RachelNormal)} />}
      </div></div>)
    )}
  </div>;
}

export default App;

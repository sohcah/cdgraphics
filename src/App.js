import React from 'react';
import './App.css';
import RachelNormal from './RachelNormal.png';
import RachelGold from './RachelGold.png';
import domtoimage from 'dom-to-image';
import {saveAs} from 'file-saver';

function screenshot(i,date) {
  console.log(i,date);
  domtoimage.toBlob(document.getElementById('image'+i),{width:800,height:600})
    .then(function (blob) {
      console.log(blob);
      (window.saveAs||saveAs)(blob, date.replace(/\//g,'-')+'-'+i+'.png');
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
}

function generateLetterTiles(letters, solution, x) {
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
    for (var letter of bottom) {
      top = [...top.slice(0, top.indexOf(letter)), null, ...top.slice(top.indexOf(letter) + 1)]
    }
    return {
      top,
      bottom,
      type: "letters",
      ...x,
      gold: !top.find(i => i)
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
  var [letters, setLetters] = React.useState("");
  var [solutions, setSolutions] = React.useState([""]);
  var [l1, setL1] = React.useState("");
  var [l2, setL2] = React.useState("");
  var [l3, setL3] = React.useState("");
  var [l4, setL4] = React.useState("");
  var [date, setDate] = React.useState("");
  function setSolution(index, value) {
    var x = solutions.slice();
    x[index] = value.toUpperCase();
    setSolutions(x);
  }
  var [rachel,setRachel] = React.useState(true);
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
  return <div>
  <div style={{padding:4}}>
    <div>Original design by <a href="https://www.facebook.com/100009965523845">Chloe Jones</a> for the <a href="https://www.facebook.com/groups/countdowners/">Countdowners Facebook group</a></div>
    <div>Generator developed by <a href="https://sohcah.dev">sohcah</a>, and open-sourced on <a href="https://github.com/sohcah/cdgraphics">GitHub</a></div>
  </div>
    <div style={{padding:4}}>
      <div>Letters</div>
      <input value={letters} onChange={(ev) => setLetters(ev.target.value)} />
    </div>
    <div style={{padding:4}}>
      <div>Solutions</div>
      {Object.keys(solutions).map(i => <><input style={{marginTop:i!=="0"?4:0}} placeholder={`Solution ${Number(i) + 1}`} value={solutions[i]} onChange={(ev) => setSolution(i, ev.target.value)} /><br /></>)}
      <button style={{marginTop:4}} onClick={() => setSolutions([...solutions, ""])}>Add</button>
    </div>
    
    

    <div style={{padding:4}}>
      <div>Titles</div>
      <input placeholder="Line 1" value={l1} onChange={(ev) => setL1(ev.target.value)} /><br/>
      <input style={{marginTop:4}} placeholder="Line 2" value={l2} onChange={(ev) => setL2(ev.target.value)} /><br/>
      <input style={{marginTop:4}} placeholder="Line 3" value={l3} onChange={(ev) => setL3(ev.target.value)} /><br/>
      <input style={{marginTop:4}} placeholder="Line 4" value={l4} onChange={(ev) => setL4(ev.target.value)} /><br/>
    </div>
    <div style={{padding:4}}>
      <div>Date</div>
      <input placeholder="Date" value={date} onChange={(ev) => setDate(ev.target.value)} />
    </div>
    <div style={{padding:4}}>
      Rachel <input type="checkbox" checked={rachel} onChange={(ev) => setRachel(ev.target.checked)} />
    </div>
    <div style={{padding:4}}>
      <div>Click an image to save</div>
    </div>
    {(
      ["", ...solutions].map((i,index) => generateLetterTiles(letters.toUpperCase(), i, { gold: false, index })).map(({ top, bottom, gold, index }) => <div onClick={()=>screenshot(index==0?'M':`S${index}`,date)} id={`image${index==0?'M':`S${index}`}`} className={gold ? "image gold" : "image"}>
        <div className="board" style={{ width: 600, height: 250, padding: 20, display: "flex", flexDirection: "column", justifyContent: "stretch" }}>
          <div className="rowWrapper">
            <div className="row">
              {arr.map(i => <div className={`card ${top[i] && "full"}`}>{top[i] || ""}</div>)}
            </div>
            <div className="row">
              {arr.map(i => <div className={`card ${bottom[i] && "full"}`}>{bottom[i] || ""}</div>)}
            </div>
          </div>
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
        </div>
        <div style={{ position: "absolute", top: 8, right: 8, fontSize: 14, maxWidth: 300, color: "black" }}>
        Generated by cdgraphics.sohcah.dev
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 20, maxWidth: 200, color: "white" }}>
          {date}
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 400, fontSize: 24, maxWidth: 300, color: !gold ? "#c9a779" : "white" }}>
          {l1}<br />
          {l2}<br />
          {l3}<br />
          {l4}&nbsp;
        </div>
        {rachel&&<img className={gold ? "rachelgold" : "rachel"} src={gold ? RachelGold : RachelNormal} />}
      </div>)
    )}
  </div>;
}

export default App;

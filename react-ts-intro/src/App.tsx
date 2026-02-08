import "./App.css"
import Counter from "./components/count";


const MiFuncion=()=>{

  const name= "alejandra";

  return (
    <div className= "mainContainer">
      <Counter name={name}/>
  </div>
  )
}

export default MiFuncion;
import { useState } from "react";



const Counter= ({name}: {name:string})=>{
    const [count1, setCount1]=useState<number>(0);
    const [count2, setCount2]=useState<number>(0);
    const [result, setResult]= useState<number>(0);
    const [operador, setOperador]= useState<string>("");

    const pantalla=(num: number)=>{
        operador === "" ? setCount1(num): setCount2(num);
    };

    const calculo=()=>{
        let res=0;

        switch(operador){
            case "+":
                res= count1 + count2;
                break;
            case "-":
                res= count1 - count2;
                break;
            case "*":
                res= count1 * count2;
                break;
            case "/":
                res= count2 !== 0 ? count1/count2 : 0;
                break;

        }
        setResult(res);
        setOperador("");
        setCount1(0);
        setCount2(0);
    };

    const limpiarPantalla=()=>{
        setCount1(0);
        setCount2(0);
        setOperador("");
        setResult(0);
    };
    
    
    return (
    <div className="calculadora">

    <div className="pantalla">
      {count1}{" "}{operador}{" "}{count2}
      
    </div>   
    

    <div className="numeros">
      <button onClick={()=>pantalla(1)}>1</button>
      <button onClick={()=>pantalla(2)}>2</button>
      <button onClick={()=>pantalla(3)}>3</button>  
    </div>

    <div className="numeros">
      <button onClick={()=>pantalla(4)}>4</button>
      <button onClick={()=>pantalla(5)}>5</button>
      <button onClick={()=>pantalla(6)}>6</button>
    </div>
      
    <div className="numeros">
      <button onClick={()=>pantalla(7)}>7</button>
      <button onClick={()=>pantalla(8)}>8</button>
      <button onClick={()=>pantalla(9)}>9</button>  
    </div>
    
    <div className="operadores">
    <button onClick={()=>setOperador("+")}>+</button> 
    <button onClick={()=>setOperador("-")}>-</button> 
    <button onClick={()=>setOperador("*")}>*</button> 
    <button onClick={()=>setOperador("/")}>/</button> 
    </div>

    <button className= "igual" onClick={calculo}>=</button> 
    <button className= "limpiar" onClick={limpiarPantalla}>AC</button>

    <p className="resultado">Resultado: {result}</p>

      
  </div>
 
);
}

export default Counter;
import React,{ useState } from "react";
import SearchIcon from '@material-ui/icons/Search';
import "./Search.css";

function Search({countries,onSearch}){
  const [inputText,setInputText]=useState("");

  function handleChange(event){
    const text=event.target.value;
    setInputText(text);
  }

  function handleClick(){
    let flag=1;
    countries.forEach((country)=>{
      if(country.name===inputText){
        onSearch(inputText);
        flag=0;
      }
    });
    if(flag===1)
    alert("No matching country found!");
  }

  return(
    <div className="search">
      <input
        onChange={handleChange}
        value={inputText}
        type="text" className="search__input"
        placeholder="Search countries"
      />
      <SearchIcon
        onClick={handleClick}
        className="search__icon"
      />
    </div>
  )
}

export default Search;

import {database} from "./indexeddb"



class Store {
  constructor(init ) {
    const self = this;
    // store is context 
    this.subscribers = [];
    database.then(async (db) => {
      this.db = db
      const comment = await db.get("comments", "comment")
      if(comment){
        for(const[key,value] of Objects.entries(comment))
        this.set[key,value]
      }
 
    })




    this.state = new Proxy(init, {
      async set(state, key, value) {
        state[key] = value;
       

          if(self.db){
          await self.db.add("comments", 
          value[value.length - 1])
          }







        console.log(self.subscribers)
        self.subscribers.forEach((subscriber) => subscriber(state));
        
        console.log('this is the set method')
       
        // return true;
      },
    });
  }
  subscribe(cb) {
    if (typeof cb !== "function") {
      throw new Error("You must subscribe with a function");
    }
    console.log(this.subscribers)
  this.subscribers.push(cb);
  console.log(cb)
   
  // console.log('we have subscribed')
    
    
  }
  addComment(state, value) {

    
    let newState = state.comments.push(value)
    console.log(newState)
    // returns length of array 
    console.log(value)
    console.log(newState)
    console.log(this.state.comments)
    this.state = Object.assign(this.state, state)
    
    console.log(this.state)
    
  }
  getAllComments() {
    return this.state.comments;
  }

  // anytime the state changes (when a new comment comes in / delete comments .. any change to comment chnages state) 
  // only 1 sub that renders to html

  // 
}

const store = new Store({ comments:[] });
console.log(store);
// create new store and want to sub to store 
// sub to store anytime state changes subscriber is going to call method (adding comment)
store.subscribe((state) => {
  console.log(state)
  let commentState = state.comments;
 
  commentState.forEach(subComment => document.body.appendChild(subComment))
  
});

// want bunch of comments to show
// call on the component class to render the comments submitted
// use the connected call back to call on html

class CommentComponent extends HTMLElement {
  constructor() {
    super();
    this.name = ''
    this.email = ''
    this.comment = ''

    // to init the proper 
    // used open string later will be changed 
  }
//  look out for attr 
// if change then call changed att method
  static get observedAttributes() {
    return ["name", "email", "comment"];
  }
// not talking about property but attr 

// this method is to know if user adds new value, this method refelcts that value 
// refelect the change in the js props 
// update the prop to let it know we have the att
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue; 
    // updating the empty string with the new value; 
    // using [] because dont quite know the atrr === this.name , this.email etc 

    
  }

  //  connected callabck is for custom element
  // add html to build custom element
  // listeners related to custom element
  // has to be related to custom element
  // no btn event listener
  // btn is not apart of the custom element

  connectedCallback() {
    // will be claaed fist time DOM is loaded
    this.innerHTML = `
    <p> Name:  ${this.name} </p>
    <p> email: ${this.email} </p> 
    <p> comment: ${this.comment} </p>
    `
  }
}
// name.email,comment are properties of JS 
// 

window.customElements.define("comment-component", CommentComponent);


















document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#button");
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    let commentDisplay = document.createElement('comment-component')
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let comment = document.getElementById("comment").value
    let commentObject = {
      name: `${name}`,
      email: `${email}`,
      comment: `${comment}`,

    }
    commentDisplay.setAttribute("name", commentObject.name)
    commentDisplay.setAttribute("email", commentObject.email)
    commentDisplay.setAttribute("comment", commentObject.comment)
    document.body.appendChild(commentDisplay)
    
    store.addComment(store.state, commentObject);
  
  
   
  });
});

// export default CommentComponent
export default "./commentComponent.js";
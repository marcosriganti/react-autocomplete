# Questions

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

The main difference is that the PureComponent (either a class component or functional component) is that will always try to avoid/skip re-render if the the props and state remains the same after a shallow comparison. Avoiding the render will reduce the impact in the DOM improving that way the performance; however due to the the shallow comparison it might require a better one, deeper and likely logic to be apply. One easy way to prove the fail due the shallow comparison would be nest a PureComponent within a Component, not updating the PureComponent prop passed down, would not trigger the right re-render.

```javascript

    class Child extends PureComponent {
	    render() {
		    console.log('updated');
		    return <div>Hi!</div>;
	    }
    }
    class Parent extends React.Component {
	    state =  {collection: { items: [ {id: 1, name: "joe"} ], pagination: {total: 4, current: 1}}}
	    update (){ const copy = this.state.collection; copy.items[0].name='jane'; this.setName({ collection: copy }); }
	    render () {
		    return <><Child data={data}/><button onClick={update}>Click me</button></a>
	    }
	}
```

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

We use shouldComponentUpdate in order to compare the current props and state with the coming one, to make the decision if we should re render or not, a negative will help to avoid the re-render, that being said, props and state can be really complex when we try to compare, how deeply we do, and implement logic to achieve that comparison in the component can be expensive as well, Also, we also change the Context from different components in the app, that might infer more comparisons that expected since it can be made from components totally isolated from the first one; therefore it would be better to relay in just one simple logic, and likely avoid class and move to functional components, to reduce even more rendering we can use manage state and useContext hooks.

## 3. Describe 3 ways to pass information from a component to its PARENT.

1- One of the most simple ways si to pass a callback to the child component as prop, this callback already has access to the parent props and parent state, this way being able to affect the parent rendering and any other child component who depends on the parent props/state. However this option wouldn't be the best if we have to pass it down many children of children components, cause we would be repeating over and over the same prop, that might be in a conflict with any other prop that happens to be named the same.

```javascript
const Parent = () => {
  const handleSuccess = () => {};
  return <Child onSuccess={handleSuccess} />;
};
```

2 - Another way is **useContext**,

```javascript

    import {createContext, useContext, useState};
    const BackgroundContext = createContext();
    const Parent = () => {
	    const [background, setBackground] = useState("#FFF");
	    return (
		   <BackgroundContext.Provider value={{ background, setBackground }}>
		    // Now with the provider, using the useContext all the nested children components can modify the following wrapper
			<div style={{backgroundColor: background}}
		    <Child />
	    </BackgroundContext.Provider> );
    };
    const Child = () => {
	    const { setBackground } = useContext(BackgroundContext);
	    return <button onClick={() => { setBackground("red"); }}>Make it red</button>;
    };
```

3 - Add a Listener/Dispatcher to an Event.
We can use libraries or also use more pure javascript to enable the communication of not necessary nested components.

```javascript
      import React from 'react';
      const Child = () => {
      const emitEvent = () => {
	      const event = new CustomEvent('EventAttack', { details: { type: 'ninjutsu', user:'naruto' } });
	      // Emit/dispatch the event globally
	      window.dispatchEvent(event);
	      };
	    return (<div>
	      <button onClick={emitEvent}>Emit Attack!</button>
	      </div> );
	   };

	   const Parent () => {
		   useEffect(() => {
		   // adding listener
		   const handleEvent = (e) =>  {
			   console.log(`${e.details.user} attacks with a ${e.details.type} technique`);
			}
		   window.addEventListener('EventAttack', handleEvent);
			}, [])
		}
```

## 4. Give 2 ways to prevent components from re-rendering.

For functional components we can use **useMemo** hook, and similar for class components we can use the **shouldComponentUpdate** the key for both cases is to compare the current and coming state, and from there take the decision to re-render or not.
1- **useMemo**

```javascript
const Child = ({data}) => {
  // Prop that might be updated or not in the parent
  const memoValue = useMemo(() => {
    return parseWithExpenseLogic(data);
  }, [data]); // Here detects if data was updated or not
  return <div>{memoValue}</div>;
};
```

2- shouldComponentUpdate

```javascript
class Child extends Component {
  shouldComponentUpdate(nextProps) {
    // Here we decide if we should render again or not, based on desired logic
    return nextProps.dataValue !== this.props.dataValue;
  }
  render() {
    return <div>{this.props.dataValue}</div>;
  }
}
```

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

When a component has to return to render we must return only one react element, that can have several children, however sometimes there's no real need to return nested component, in order to avoid add unnecessary nodes at the end to the DOM, we can use Fragment that is a simple expression/tag for example

```javascript
<>
  <component />
  <component />
</>
```

instead of

```javascript
<div>
  <component />
  <component />
</div>
```

If we do not use the fragment and return of sibling node will break the app

    const Breaking = () => {
    	return <div/><div/>
    }

## 6. Give 3 examples of the HOC pattern.

A HOC, means High Order Component, it's the way we can reuse existing component but adding more use, features, layout and props.

1-Given a Picture component, we can create a Frame component that adds a layer around the Picture.

```javascript
const Picture = (props) => <img src={props.img} />;
const withFrame = (Comp) => (props) => {
  return (
    <div className='frame'>
      <Comp {...props} />
    </div>
  );
};
const newPic = withFrame(Picture)({img: Image});
```

2- Given a Modal component we use it to wrap the app to make it available anywhere in the app. same as previous logic

```javascript

     const Modal = (props) => {
     return <div>{props.children}</div>
     }
     const withModal = (Comp) => (props) => {
    	 const [visibleModal, setVisibleModal] = useState(false);
    	 const [modalContent, setModalContent] = useState('');
    	 return <><Comp {..props}    /><Modal>{modalContent}</Modal></>
    }
```

So instead of <App/> we can use withModal(App); and have a modal accesible anywhere under the App with props that can be passed to their children components too.

3- A very usual way is also to wrap a whole page with a check for Auth, in case the page we are about to show requires the user to be logged in we can filter and refuse or redirect the user

```javascript
const withLogin = (Page) => (props) => {
  if (!props.user) return null;
  return Page;
};
const UserAccountPage = (props) => {
  //...
};
/* We can easily define withLogin in one place, and then just update the export line in each page that requires some user auth check, 
	and avoid to check in each individual page, so we can isolate the logic that's not really related to the page component. */
export default withLogin(UserAccountPage);
```

## 7. What's the difference in handling exceptions in promises, callbacks and async…await?

All the errors are being handle slightly differently .
When we use Promises we can use the chained catch method

```javascript
    const somePromise = () => new Promise(resolve, reject) => {....}
    somePromise().then(response => { // all good in here}).catch(error => { // here in error we have the details provided by the promise })
```

For the async await, and the callback as well, we can easily use the try/catch

```javascript
    const fetchData = async (saveData) => {
	    let data;
	    try {
		    // in here we can stack several promises call
		     data = await fetch(...);
		     saveData(data); // callback
		} catch (e) {
			// any promise error will be catch in here, including the callback saveData
			console.log('error', e)
		}
		// If we just want to catch the await promise without the try catch we can just chain the catch
		const moreData = await fetch(...).catch(e => { console.log('Oops', e) })
	    return data;
	}
```

## 8. How many arguments does setState take and why is it async.

**setState** is meant to be used in a React Class components, it takes 2 arguments, the first one either and **object**, to be used as a new state, or a **function** that takes the previous state and should return the new one; the second argument it's a callback, a **function** to be executed once the new state takes place.

It's async due the fact that the component usually holds several properties in the state, all the states is being controlled by the different methods in the Class in reflection of the user interactions, events, time etc; having a synchronized state will be blocking the user experience resulting in a "not natural" experience for them.

## 9. List the steps needed to migrate a Class to Function Component.

Going back to the Javascript concepts a Class it's a construction based in functions. Similar happens in React; a Class handles constructors, props, state and several methods related to the lifecycle of the component itself.
A list of usual changes that have to take place would be
| class| functional |
|--|--|
| **Definition** |
| class Human extends React.Component | const Human = (props) => {} |
| **State manage** |
| this.setState({race: 'latino'}) | const [race, setRace] = useState(null); setRace('latino') |
| **Lifecycle** |
| componentDidUpdate(); shouldComponentUpdate() | useEffect(()=>{}, [prop]) |
| **Initialize** |
| constructor () { super(props); this.state = {...} ...} | not required |
| **Render** |
| render () { ...} | return <>{...}</> |

## 10.List a few ways styles can be used with components.

There are several ways of using styles in your components.

The most simple one is to create a css file and add to your tags the "className" tag, and import the css file

1 - The easy quick way is having a css file and import it. then use the class names defined in the css

```javascript
import './styles.css';
const Component = () => <div className='container'>styled copy</div>;
```

2 - Having inline styles

```javascript
const Component = () => (
  <div style={{margin: '2rem', fontSize: 12, padding: '10px'}}>styled copy</div>
);
```

3 - Having frameworks for markup style Like TailWind CSS, using this most of the code can be written without using textual css

    npm install -D tailwindcss

```javascript
const ButtonComponent = () => (
  <Button className='text-sm bg-orange-700 text-neutral-50'>Click Me</Button>
);
```

4 - Having styled components

```javascript
    import styled, { css } from 'styled-components' // library
    const Button = button.`border: 1px solid red`; // pure css here, but accepts props too and can extend existing definitions too
    const ButtonComponent= () => <Button>Click Me</Button>
```

## 11. How to render an HTML string coming from the server.

When we get a response from the server thats a string and it's HTML, we can simple render it

```javascript
    <div dangerouslySetInnerHTML={{ __html: serverText }></div>
```

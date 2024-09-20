# Questions

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

The main difference is that the PureComponent (either a class component or functional component) is that will always try to avoid/skip re-render if the the props and state remains the same. Avoiding the render will reduce the impact in the DOM improving that way the performance.

### Answer

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

## 3. Describe 3 ways to pass information from a component to its PARENT.

1- One of the most simple ways si to pass a callback to the child component as prop, this callback already has access to the parent props and parent state, this way being able to affect the parent rendering and any other child component who depends on the parent props/state. However this option wouldn't be the best if we have to pass it down many children of children components, cause we would be repeating over and over the same prop, that might be in a conflict with any other prop that happens to be named the same.

const ParentComponent = () => {

const handleSuccess = () => {}

return <>

<ChildComponent onSuccess={handleSuccess}/>

</>

}

2 - Another way is useContext,

3 - Add a Listener/Emiter to an Event.

## 4. Give 2 ways to prevent components from re-rendering.

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

When a component has to return to render we must return only one react element, that can have several children, however sometimes there's no real need to return nested component, in order to avoid add unnecessary nodes at the end to the DOM, we can use Fragment that is a simple expression/tag for example

    <><component/><component/></>

instead of

    <div><component/><component/></div>

## 6. Give 3 examples of the HOC pattern.

## 7. What's the difference in handling exceptions in promises, callbacks and async…await?

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

1 - Having a css file

style.css

.button {

//

}

.btn-primary {

background:red;

}

2 - Having inline styles

3 - Having frameworks for markup style

4 - Having style components

## 11. How to render an HTML string coming from the server.

When we get a response from the server thats a string and it's HTML, we can simple render it

    <div dangerouslySetInnerHTML={{ __html: serverText }></div>

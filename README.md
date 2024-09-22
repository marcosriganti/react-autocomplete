# Deels Test for Front End

## Autocomplete module with Async data

## Rules to keep in mind that were given

1. Performance matters as we are expecting a production ready component.
2. You cannot use any 3rd party libraries-only pure React and internal DOM functions.
3. You should use TypeScript and write proper interfaces and types.
4. The function to filter the data should be asynchronous. You can use mock data (such as a JSON array), but the function which uses it should be asynchronous (similar to a real REST call).
5. It should have basic working CSS. No need for anything fancy (such as drop shadows etc).
6. You need to handle all non-standard/edge use-cases - it should have a perfect user-experience.
7. Highlight the matching part of the text,in addition to showing it.
8. No external state management libraries(refer to #1 as well), only native React method.
9. Use only functional components with hooks.
10. Shortcuts and hacks are ok - but you have to add comments on what you are doing and why.
11. Add a README.md file explaining how to run the project.
12. Bonus Point: Load data using a real API call to some resource.

## Notes

- The Data is being fetched is an anime information one https://api.jikan.moe/v4/anime
- There's a questions readme with questions and answers
- There were hooks created useDebounce to prevent massive fetch requests and a useQuery hook to handle the fetc with the use of LocalStorage to avoid repeat a made request
- Once a suggestions list for the autocomplete is given you can move using Tab and close with Esc and select with Enter using your keyboard or always use your mouse/track pad with select. scroll and clear.

## Available Scripts to run

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

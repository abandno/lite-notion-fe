import React, {createContext, useContext, useEffect, useState} from "react";


export const EditorContext = createContext({
  currentDocumentTitle: null,
  setCurrentDocumentTitle: null,
})
export const EditorContextProvider = ({
                                 children,
                                 onCurrentDocumentTitleChange = undefined
                               }) => {
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState();
  useEffect(() => {
    onCurrentDocumentTitleChange && onCurrentDocumentTitleChange(currentDocumentTitle);
  }, [currentDocumentTitle])

  return (
      <EditorContext.Provider value={{currentDocumentTitle, setCurrentDocumentTitle}}>
        {children}
      </EditorContext.Provider>
  )
}

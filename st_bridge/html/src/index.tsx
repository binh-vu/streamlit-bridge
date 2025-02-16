import { Streamlit, RenderData } from "streamlit-component-lib";

const root = document.body.appendChild(document.createElement("div"));

let container: HTMLDivElement | null = null;

function getContainer() {
  if (container !== null) return container;

  const iframes = window.parent.document.getElementsByTagName("iframe");
  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i];
    if (
      (iframe.contentDocument || iframe.contentWindow?.document) === document
    ) {
      container = iframe.parentElement! as HTMLDivElement;
    }
  }

  if (container === null) {
    console.error("Failed to identify the container of the HTML component");
  }

  return container;
}

// get the global where stBridges stores data
function getGlobal() {
  let global: Window;
  try {
    /* Try to access a property of window.top. This will fail when window.top
       is unset or cross-origin doesn't allow us to access window.top
     */
    global = window.top || window.parent;
  } catch {
    global = window.parent;
  }
  return global;
}
const global = getGlobal();

// create a reference to the stBridges object in the topmost window so we can access it from nested iframes.
(window as any).stBridges = (global as any).stBridges;
if ((window as any).parent !== undefined) {
  (window as any).parent.stBridges = (global as any).stBridges;
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  const data = (event as CustomEvent<RenderData>).detail;

  const html = data.args["html"];
  const iframe = data.args["iframe"];

  if (iframe === true) {
    root.innerHTML = html;
    Streamlit.setFrameHeight();

    return;
  }

  // not render inside iframe, we create a div sibling and render it there
  const container = getContainer();
  if (container === null) return;

  if (container.lastElementChild!.tagName.toLowerCase() === "iframe") {
    // need to create a new div to render the html
    const div = window.parent.document.createElement("div");
    container.appendChild(div);
    // hide the iframe
    (container.firstElementChild! as HTMLElement).style.display = "none";
  }

  container.lastElementChild!.innerHTML = html;
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady();

// Finally, tell Streamlit to update our initial height. We omit the
// `height` parameter here to have it default to our scrollHeight.
Streamlit.setFrameHeight();

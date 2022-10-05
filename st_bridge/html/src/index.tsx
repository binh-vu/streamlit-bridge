import { Streamlit, RenderData } from "streamlit-component-lib";

const root = document.body.appendChild(document.createElement("div"));

let container: HTMLDivElement | null = null;

function getGlobal() {
  let global: Window;
  try {
    /* Try to access a property of window.top. This will fail when window.top
       is unset or cross-origin doesn't allow us to access window.top
     */
    const stBridges = (window.top as any).stBridges;

    global = window.top || window.parent;
  } catch {
    global = window.parent;
  }
  return global;
}

function getContainer() {
  if (container !== null) return container;

  const iframes = getGlobal().document.getElementsByTagName(
    "iframe"
  );
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
    const div = getGlobal().document.createElement("div");
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

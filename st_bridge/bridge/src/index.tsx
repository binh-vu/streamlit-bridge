import { Streamlit, RenderData } from "streamlit-component-lib";

class Bridge {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public sendText = (text: string) => {
    Streamlit.setComponentValue(text);
  };

  public sendData = (data: object) => {
    Streamlit.setComponentValue(JSON.stringify(data));
  };
}

// store data in the topmost window in the window hierarchy as the component
// is rendered inside an iframe.
const global = window.top || window.parent;
if ((global as any).stBridges === undefined) {
  const stBridges = {
    bridges: {} as { [key: string]: Bridge },
    sendText: (name: string, text: string) => {
      stBridges.bridges[name].sendText(text);
    },
    sendData: (name: string, data: object) => {
      stBridges.bridges[name].sendData(data);
    },
  };
  (global as any).stBridges = stBridges;
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  const data = (event as CustomEvent<RenderData>).detail;

  const stBridges = (global as any).stBridges;
  const bridge = data.args["name"];
  if (stBridges.bridges[bridge] === undefined) {
    stBridges.bridges[bridge] = new Bridge(bridge);
  }

  // We tell Streamlit to update our frameHeight after each render event, in
  // case it has changed. (This isn't strictly necessary for the example
  // because our height stays fixed, but this is a low-cost function, so
  // there's no harm in doing it redundantly.)
  // Streamlit.setFrameHeight();
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady();

// Finally, tell Streamlit to update our initial height. We omit the
// `height` parameter here to have it default to our scrollHeight.
// Streamlit.setFrameHeight();

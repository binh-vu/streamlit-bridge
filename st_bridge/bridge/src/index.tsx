import { Streamlit, RenderData } from "streamlit-component-lib";

class Bridge {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public send = (data: any) => {
    Streamlit.setComponentValue(data);
  };
}

// store data in the topmost window in the window hierarchy as the component
// is rendered inside an iframe.
const global = window.top || window.parent;
if ((global as any).stBridges === undefined) {
  const stBridges = {
    bridges: {} as { [key: string]: Bridge },
    send: (name: string, data: any) => {
      stBridges.bridges[name].send(data);
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
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady();

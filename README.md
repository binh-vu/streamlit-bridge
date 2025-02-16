# Streamlit Bridge ![PyPI](https://img.shields.io/pypi/v/streamlit-bridge) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Two <a href="https://streamlit.io/">Streamlit</a> components that allow client side (javascript) to send data to the server side (python) and render HTML content without being processed by Markdown.

## Introduction

These two components offer more flexibility in creating Streamlit applications by allowing you to easily incorporate HTML and JS.

Here are some examples:

1. [List of inline buttons](/examples/inline_buttons.py) ![Streamlit inline buttons](/examples/inline_buttons.gif)

   ```python
   import streamlit as st
   from st_bridge import bridge, html

   data = bridge("my-bridge", default="no button is clicked")

   html("""
   <button onClick="window.top.stBridges.send('my-bridge', 'button 1 is clicked')">Button 1</button>
   <button onClick="window.top.stBridges.send('my-bridge', 'button 2 is clicked')">Button 2</button>
   <button onClick="window.top.stBridges.send('my-bridge', 'button 3 is clicked')">Button 3</button>
   """)

   st.write(data)
   ```

2. [Timer](/examples/timer.py)

## Installation

```bash
pip install streamlit-bridge
```

## API

Bridge Component

```python
def bridge(
    name: str,
    default: Optional[Any] = None,
    key: Optional[str] = None,
):
    """Create a new instance of "Streamlit Bridge", allowing call from the client to
    the server.

    Everytime JS client send data to the server, streamlit will trigger a rerun and the data
    is returned by this function.

    Args:
        name: unique name of the bridge to identify the bridge Javascript's call will send data to
        default: the initial return value of the component before the user has interacted with it.
        key: streamlit component's id
    """
```

To send data from the client to a corresponding bridge component with `<bridge-name>`, use the function: `window.stBridges.send(<bridge-name>, <data>);` or `window.top.stBridges.send(<bridge-name>, <data>);` if you are running it inside an component (i.e., running inside an iframe) or Streamlit Cloud. Note that `window.top` is important to access the `stBridges` variable stored in the top-most window by the bridge component.

HTML Component

```python
def html(html: str, iframe: bool = False, key: Optional[str]=None) -> None:
    """Render HTML in Streamlit without being processed by Markdown.

    Args:
        html: HTML to render
        iframe: whether to render the HTML in an iframe or in the main document.
                By default streamlit component is rendered inside an iframe, so by
                setting it to false, we allow the HTML to rendered in the main document.
        key: streamlit component's id
    """
    pass
```

Note: as of version 1.1.7, the HTML component automatically creates a reference to stBridges in the top-most window, so using `window.top.stBridges` is no longer necessary; instead, you can just use the `stBridges` variable directly (e.g., `stBridges.send(...)`). If you have trouble accessing `stBridges`, try using `window.top.stBridges` in the console of the browser to debug.

## Development

- To build a streamlit component after modifying them:
  - visiting their folder: `st_bridge/<component>`
  - run `yarn install; yarn build`
- To test a component interactively, set `_RELEASE = False` in `st_bridge/<component>.py` and run `streamlit run st_bridge/<component>.py`
- To release, build the streamlit components first, then run `poetry publish --build`.

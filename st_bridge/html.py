import os
from typing import Optional
import streamlit as st
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = True

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _html_func = components.declare_component(
        "html",
        url="http://localhost:3000",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "html/build")
    _html_func = components.declare_component("html", path=build_dir)


def html(html: str, iframe: bool = False, key: Optional[str]=None) -> None:
    """Render HTML in Streamlit without being processed by Markdown.
    
    Args:
        html: HTML to render
        iframe: whether to render the HTML in an iframe or in the main document. 
                By default streamlit component is rendered inside an iframe, so by 
                setting it to false, we allow the HTML to rendered in the main document.
        key: streamlit component's id
    """
    if iframe:
        return _html_func(html=html, iframe=iframe, key=key, default="")
    
    with st.container():
        _html_func(html=html, iframe=iframe, key=key, default="")


# Some test code for development.
# Run: `$ streamlit run st_bridge/html.py`
if not _RELEASE:
    import streamlit as st

    st.title("Streamlit HTML Component")
    content = st.text_area("HTML", value="""
    <h1>Hello world</h1>
    <div>
    <code>Hello world</code>
    <p><pre>Hello world</pre></p>
    <p><code>Hello world  2</code></p>
    </div>
    """)
    html(content, iframe=False)

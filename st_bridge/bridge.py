from optparse import Option
import os
from typing import Any, Optional
import orjson
import streamlit.components.v1 as components

_RELEASE = True

if not _RELEASE:
    _bridge = components.declare_component(
        "bridge",
        url="http://localhost:3000",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "bridge/build")
    _bridge = components.declare_component("bridge", path=build_dir)


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
    val = _bridge(name=name, key=key, default=default)
    return val


# Some test code for development.
# Run: `$ streamlit run st_bridge/bridge.py`
if not _RELEASE:
    import streamlit as st

    st.title("Streamlit Bridge")

    text = bridge("aaa")
    st.write("Message from browser: %s" % text)

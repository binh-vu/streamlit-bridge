import streamlit as st
from st_bridge import bridge, html


data = bridge("my-bridge", default="no button is clicked")

html("""
<button onClick="stBridges.sendText('my-bridge', 'button 1 is clicked')">Button 1</button>
<button onClick="stBridges.sendText('my-bridge', 'button 2 is clicked')">Button 2</button>
<button onClick="stBridges.sendText('my-bridge', 'button 3 is clicked')">Button 3</button>
""")

st.write(data)
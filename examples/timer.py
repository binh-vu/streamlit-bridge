import streamlit as st
import streamlit.components.v1 as components
from st_bridge import bridge, html

data = bridge("my-bridge", default={"current_time": ""})

st.subheader("Current Time: %s" % data['current_time'])

components.html("""
<script>
    function setTime() {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        window.parent.stBridges.send("my-bridge", { current_time: time });
    }
    function endlessLoop() {
        setTimeout(() => {
            setTime();
            endlessLoop();
        }, 333);
    }
    endlessLoop();
</script>
""")
#!/bin/bash
# /* ---- 💫 https://github.com/JaKooLit 💫 ---- */  ##
# Scripts for refreshing ags, waybar, rofi, mako, wallust

SCRIPTSDIR=$HOME/.config/hypr/scripts
UserScripts=$HOME/.config/hypr/UserScripts

# Define file_exists function
file_exists() {
    if [ -e "$1" ]; then
        return 0
    else
        return 1
    fi
}

# Kill already running processes
_ps=(waybar rofi mako ags)
for _prs in "${_ps[@]}"; do
    if pidof "${_prs}" >/dev/null; then
        pkill "${_prs}"
    fi
done

# Refresh waybar borders or whatever needs SIGUSR2
killall -SIGUSR2 waybar 

# Send SIGUSR1 to these procs (لو محتاجين)
for pid in $(pidof waybar rofi ags swaybg); do
    kill -SIGUSR1 "$pid"
done

# Restart waybar
sleep 1
waybar &

# Relaunch mako
sleep 0.5
mako &

# Relaunching rainbow borders if the script exists
sleep 1
if file_exists "${UserScripts}/RainbowBorders.sh"; then
    ${UserScripts}/RainbowBorders.sh &
fi

exit 0

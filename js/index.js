function initIndex()
{
    let menuOptionsToggle = document.getElementById("menu-options-toggle");

    ['click'].forEach(eventName => {
        menuOptionsToggle.addEventListener(eventName, toggleMenuOptions, false)
    });
}

function toggleMenuOptions()
{
    let menuOptions = document.getElementById("menu-options");

    menuOptions.style.display = (['', 'none', undefined].includes(menuOptions.style.display))?'block':'none';

    ['click'].forEach(eventName => {
        window.addEventListener(eventName, closeMenuOptions, false);
    });
}

function closeMenuOptions(e)
{

    let menuOptionsToggle = document.getElementById("menu-options-toggle");
    if (e.target != menuOptionsToggle)
    {
        let menuOptions = document.getElementById("menu-options");
        menuOptions.style.display = "none";

        ['click'].forEach(eventName => {
            window.removeEventListener(eventName, closeMenuOptions, false);
        });
        return false;
    }
}
function toggleVideoHelp() {
    let vid = document.getElementById('reportFileVideoHelp');

    if (vid.style.display === 'none') vid.style.display = 'block';
    else vid.style.display = 'none';

}

window[ addEventListener ? 'addEventListener' : 'attachEvent' ]( addEventListener ? 'load' : 'onload', initIndex );
//function initIndex(){let a=document.getElementById("menu-options-toggle");["click"].forEach(b=>{a.addEventListener(b,toggleMenuOptions,!1)})}function toggleMenuOptions(){let a=document.getElementById("menu-options");a.style.display=["","none",void 0].includes(a.style.display)?"block":"none",["click"].forEach(a=>{window.addEventListener(a,closeMenuOptions,!1)})}function closeMenuOptions(a){let b=document.getElementById("menu-options-toggle");if(a.target!=b){let b=document.getElementById("menu-options");return b.style.display="none",["click"].forEach(a=>{window.removeEventListener(a,closeMenuOptions,!1)}),a.preventDefault(),!1}}window[addEventListener?"addEventListener":"attachEvent"](addEventListener?"load":"onload",initIndex);
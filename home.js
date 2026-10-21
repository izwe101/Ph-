const introText = document.getElementById("introText");
const projectHeading = document.getElementById("projectHeading");

function typeMessage(element, text, callback) {
    let charIndex = 0;

    element.innerHTML = '<span class="cursor">|</span>';

    function type() {
        if (charIndex < text.length) {

            element.innerHTML =
                text.slice(0, charIndex + 1) +
                '<span class="cursor">|</span>';

            charIndex++;

            setTimeout(type, 23);

        } else if (callback) {

            setTimeout(callback, 500);

        }
    }

    type();
}

typeMessage(
    introText,
    "Welcome to the ProjectHub by izwe.",
    () => {
        typeMessage(
            projectHeading,
            "A fewv front-end projects i made "
        );
    }
);
console.log(projectHeading);
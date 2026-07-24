const popup = document.querySelector("#onboarding-popup");

const title = document.querySelector("#onboarding-title");

const text = document.querySelector("#onboarding-text");

const nextBtn = document.querySelector("#next-onboarding");

const skipBtn = document.querySelector("#skip-onboarding");

const stepNumber = document.querySelector("#step-number");

const dots = document.querySelectorAll(".progress-dots span");

const steps = [

{
    title:"Welcome to Cube Solver",
    text:"A 3D Rubik's Cube simulator with solving features."
},

{
    title:"Control the Cube",
    text:"Use mouse drag to rotate the camera and explore the cube."
},

{
    title:"Make Moves",
    text:"Use keyboard controls or interact with cube faces to rotate layers."
},

{
    title:"Solve The Cube",
    text:"Use Solver mode to get the optimal solution."
}

];


let currentStep = 0;



function startOnboarding(){

    const visited =
    localStorage.getItem("cubeSolverVisited");


    if(!visited){

        popup.classList.remove("hidden");

        updateStep();

    }

}



function updateStep(){

    title.innerText =
    steps[currentStep].title;


    text.innerText =
    steps[currentStep].text;


    stepNumber.innerText =
    currentStep + 1;


    dots.forEach((dot,index)=>{

        if(index === currentStep){

            dot.classList.add("active");

        }
        else{

            dot.classList.remove("active");

        }

    });


    if(currentStep === steps.length-1){

        nextBtn.innerText = "Get Started 🚀";

    }
    else{

        nextBtn.innerText = "Next →";

    }

}



nextBtn.addEventListener(
"click",
()=>{

    currentStep++;


    if(currentStep >= steps.length){

        closeOnboarding();

    }
    else{

        updateStep();

    }

});



skipBtn.addEventListener(
"click",
closeOnboarding
);



function closeOnboarding(){

    popup.classList.add("hidden");


    localStorage.setItem(
        "cubeSolverVisited",
        "true"
    );

}



startOnboarding();
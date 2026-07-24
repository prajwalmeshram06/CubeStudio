export function createAboutPage(){

    const page =
        document.getElementById(
            "about-page"
        );


    page.innerHTML = `

        <h1>
            About This Project
        </h1>


        <p class="about-subtitle">
            A 3D interactive Rubik's Cube Solver built
            as a long-term computer science project.
        </p>



        <div class="about-grid">


            <div class="about-card">

                <h2>
                    Project Overview
                </h2>

                <p>
                    This project is an interactive
                    Rubik's Cube simulator and solver
                    built completely from scratch.
                </p>


                <p>
                    Users can simulate cube movements,
                    enter cube configurations manually,
                    validate cube states, and solve
                    cubes using an algorithmic solver.
                </p>

            </div>



            <div class="about-card">

                <h2>
                    ⚙ Technologies Used
                </h2>

                <ul>

                    <li>JavaScript (ES6 Modules)</li>

                    <li>Three.js - 3D Rendering</li>

                    <li>HTML & CSS</li>

                    <li>Python API Backend</li>

                    <li>Kociemba Solver Algorithm</li>

                    <li>OpenCV.js (Coming Soon)</li>

                </ul>

            </div>



            <div class="about-card">

                <h2>
                     Developer
                </h2>


                <p>
                    Built by <b>Prajwal</b>
                </p>


                <p>
                    Computer Science Engineering Student
                    interested in Computer Vision,
                    AI, Web Development and
                    real-world applications.
                </p>


            </div>



            <div class="about-card">

                <h2>
                    🔗 Connect
                </h2>


                <div class="social-links">


                    <a 
                        href="https://www.linkedin.com/in/prajwal-meshram-91b82139b/"
                        target="_blank"
                        rel="noopener noreferrer">

                        <i class="fa-brands fa-linkedin"></i>

                        <span>
                            Prajwal Meshram
                        </span>

                    </a>



                    <a 
                        href="https://github.com/prajwalmeshram06"
                        target="_blank"
                        rel="noopener noreferrer">

                        <i class="fa-brands fa-github"></i>

                        <span>
                            prajwalmeshram06
                        </span>

                    </a>



                    <a 
                        href="mailto:prajwalmeshram061@gmail.com">

                        <i class="fa-solid fa-envelope"></i>

                        <span>
                            prajwalmeshram061@gmail.com
                        </span>

                    </a>


                </div>


            </div>



            <div class="about-card">

                <h2>
                    Future Plans
                </h2>


                <ul>

                    <li>
                         Camera based cube scanning
                    </li>


                    <li>
                         AI based cube recognition
                    </li>


                    <li>
                         Mobile support
                    </li>


                    <li>
                         Better animations and UI
                    </li>


                </ul>

            </div>


        </div>

    `;

}
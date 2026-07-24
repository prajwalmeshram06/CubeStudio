import { getManualCubeNotation } from "./manualCubeNotation.js";
import { solveCube } from "../../solver/api.js";

import {
    setCubeVerified,
    setVerificationFailed
} from "./manualInput.js";

export async function verifyCube(){

    try{

        const notation =
            getManualCubeNotation();

        const result =
            await solveCube(notation);

        if(result.error){

            setCubeVerified(false);
            setVerificationFailed(true);

            return;
        }

        setVerificationFailed(false);
        setCubeVerified(true);

    }

    catch(error){

        console.error(error);

        setCubeVerified(false);
        setVerificationFailed(true);

    }

}
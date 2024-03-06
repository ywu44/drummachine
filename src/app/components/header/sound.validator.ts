import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { SoundService } from "src/app/services/sound.service";



@Injectable({
    providedIn: 'root'
})
export class soundValidator {

    constructor(private soundService: SoundService) { }
    soundFileNameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const fileName = control.value;
            const valid: boolean = fileName !== '' && !/[^a-z0-9_.@()-]/i.test(fileName);
            return valid ? null : { message: 'Invalid Name' }
        }
    }

    soundTriggerValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const trigger = control.value;
            const valid: boolean = !this.soundService.soundSourcesKeyMap.has(trigger);
            // console.log(valid)
            return valid ? null : { message: 'Key has been used' }
        }
    }
}
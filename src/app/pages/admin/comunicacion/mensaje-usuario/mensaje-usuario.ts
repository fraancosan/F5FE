import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back';
import { Button2 } from '../../../../shared/btns/button2/button2';
import { Button1 } from '../../../../shared/btns/button1/button1';
import { faEnvelope, faHeading, faMessage } from '@fortawesome/free-solid-svg-icons';
import { InputString } from '../../../../shared/inputs/input-string/input-string';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Navigation } from '../../../../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Users } from '../../../../services/db/users';
import { InputTextArea } from '../../../../shared/inputs/input-text-area/input-text-area';
import { Select } from '../../../../shared/inputs/select/select';
import {usuario} from '../../../../Interfases/interfaces';
@Component({
  selector: 'app-mensaje-usuario',
  imports: [
    GoBack,
    Button2,
    Button1,
    InputString,
    InputTextArea,
    Select,
    ReactiveFormsModule,
    Spinner,
  ],
  templateUrl: './mensaje-usuario.html',
  styleUrl: './mensaje-usuario.css'
})
export default class MensajeUsuario {

  faEnvelope = faEnvelope;
  faHeading = faHeading;
  faMessage = faMessage;
  form: FormGroup;
  loading = false;
  mailOptions: {
    value: string;
    text: string;
    disabled: boolean;
  }[] = [];

  constructor(
    private navService: Navigation,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private usersService: Users
  ) {
    this.form = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.usersService.getAll().subscribe({
      next: (usuarios: usuario[]) => {
        this.mailOptions = usuarios.map(usuario => ({
          value: usuario.mail,
          text: usuario.nombre + " - " + usuario.mail,
          disabled: false
        }));
      }
    });
  }

  cancelar() {
    this.navService.toPageTop('/admin/comunicacion');
  }

  enviarMensaje() {
    if (!this.form.valid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;
    const { mail, subject, text } = this.form.value;

    this.usersService.getAll(mail).subscribe({
      next: (usuarios) => {
        if (!usuarios || usuarios.length === 0) {
          this.snackBar.open('No se encontró un usuario con ese email', 'Cerrar', { duration: 3000 });
          this.loading = false;
          return;
        }

        const usuario = usuarios[0];
        this.usersService.sendEmail(usuario.id, { subject, text }).subscribe({
          next: () => {
            this.snackBar.open('Mensaje enviado exitosamente', 'Cerrar', { duration: 3000 });
            this.form.reset();
            this.loading = false;
          },
          error: () => {
            this.snackBar.open('Error al enviar el mensaje', 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      },
      error: () => {
        this.snackBar.open('Error al buscar el usuario', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

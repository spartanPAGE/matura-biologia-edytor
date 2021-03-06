import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';

const fs = require('fs')
const cp = require('child_process'); 

@Component({
  selector: 'app-choose-repo',
  templateUrl: './choose-repo.component.html',
  styleUrls: ['./choose-repo.component.scss'],
  providers: [MdSnackBar]
})
export class ChooseRepoComponent {
  public repoLink = 'https://github.com/spartanPAGE/matura-biologia';
  public editButtonDisabled = true;
  public cloneButtonDisabled = false;

  constructor(public snackBar: MdSnackBar) {
    window['repo-location'] = '../../matura-biologia';

    if ((window['root-dir'] as string).split('\\').pop() == 'dist') {
      window['repo-location'] = '../matura-biologia';
    }

    fs.stat('matura-biologia', (err, stats) => {
      if(!err) {
        console.log('local repo found');
        this.editButtonDisabled = false;
      } else {
        console.log('repo not found');
      }
    });
  }

  public cloneRepo() {
    this.cloneButtonDisabled = true;
    this.snackBar.open('Przymierzam się do klonowania...', '', { duration: 2500, extraClasses: ['dark'] });
    cp.exec(`git clone ${this.repoLink}`, (error, stdout: string, stderr: string) => {
      this.cloneButtonDisabled = false;
      this.editButtonDisabled = false;

      const output = stdout + stderr;

      if(output.indexOf('already exists') >= 0) {
        this.snackBar.open('Repozytorium już istnieje', 'Ok', { duration: 2500, extraClasses: ['dark'] });
      } else if (output.indexOf('Cloning') >= 0) {
        this.fixRepo();
        this.snackBar.open('Gotowe!', 'Ok', { duration: 2500, extraClasses: ['dark'] });
      } else {
        console.log('error:');
        console.log(error);
        console.log('stdout:');
        console.log(stdout);
        console.log('stderr:');
        console.log(stderr);
        this.editButtonDisabled = true;
      }

    });
  }

  private fixRepo() {
    cp.exec(`cd matura-biologia && git remote remove origin && git remote add upstream ${this.repoLink}`, (err, stdout, stderr) => {
      console.log(`fix repo result: ` + JSON.stringify([err, stdout, stderr]));
    });
  }
}

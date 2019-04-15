import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

interface FieldItem {
  id: number;
  class: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Мини-игра';
  allFields: Array<FieldItem> = [];
  interval: number;
  counterForUser = new BehaviorSubject(undefined);
  counterForPC = new BehaviorSubject(undefined);
  gameOver = new BehaviorSubject(true);
  currentRandomId: number;
  randomIDIndex: number;
  modalShow = false;

  ngOnInit() {
    this.generateAllSquares();
    this.setCounters();
  }

  setChecked(square: FieldItem) {
    if (square.id === this.currentRandomId) {
      square.class = 'game-field__square checked';
    }
  }

  startNewGame() {
    const initGame = () => {
      this.gameOver.next(false);
      this.generateAllSquares();
      this.setCounters();
      this.modalShow = false;
    };

    initGame();
    let mapFieldsID = this.allFields.map(field => field.id);

    const setColorSquareById = (randomIid: number) => {
      this.allFields.filter((field) => {
        if (field.id === randomIid) {
          field.class = 'game-field__square active';
        }
      });
    };

    const addPointToCounter = () => {
      if (this.currentRandomId) {
        this.allFields.filter((square: FieldItem) => {
          if (square.id === this.currentRandomId) {
            if (square.class === 'game-field__square active') {
              square.class = 'game-field__square unchecked';
              this.counterForPC.next(this.counterForPC.value + 1);
            } else {
              this.counterForUser.next(this.counterForUser.value + 1);
            }
          }
        });
      }
      if (!this.gameOver.value) {
        nextGameStep();
      } else {
        clearInterval(refreshIntervalId);
        this.modalShow = true;
      }
    };


    const nextGameStep = () => {
      this.randomIDIndex = Math.floor(Math.random() * (mapFieldsID.length - 1));
      mapFieldsID = mapFieldsID.filter((elem, index) => {
        if (index === this.randomIDIndex) {
          this.currentRandomId = mapFieldsID[this.randomIDIndex];
        }
        if (index !== this.randomIDIndex) {
          return elem;
        }
      });
      setColorSquareById(this.currentRandomId);
    };
    const refreshIntervalId = setInterval(() => {
      addPointToCounter();
    }, this.interval);
  }

  private generateAllSquares() {
    const allFields = [];
    for (let i = 1; i <= 100; i++) {
      allFields.push(
        {
          id: i,
          class: 'game-field__square'
        });
    }
    this.allFields = allFields;
  }

  private setCounters() {
    this.counterForUser.next(0);
    this.counterForPC.next(0);
    this.subscriberToCounters();
  }

  private subscriberToCounters() {
    this.counterForPC.subscribe(val => {
      if (val === 10) {
        this.gameOver.next(true);
      }
    });
    this.counterForUser.subscribe(val => {
      if (val === 10) {
        this.gameOver.next(true);
      }
    });
  }
}

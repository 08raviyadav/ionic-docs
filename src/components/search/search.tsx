import 'ionicons';
import { Book, Close, ForwardArrow, Search } from '../../icons';

import {
  Component,
  Element,
  Listen,
  Prop,
  State
} from '@stencil/core';

@Component({
  tag: 'ionic-search',
  styleUrl: 'search.css',
  shadow: false
})
export class IonicSearch {

  @State() active = false;
  @State() query = '';
  @State() higlightIndex: number = null;
  @State() pending = 0;
  @State() results: any[] = null;
  @State() nonDocsResults: any[] = null;
  @State() nonDocsResultsActive = false;
  @State() dragStyles: {};
  // @State() pane: HTMLDivElement;
  @Prop() mobile: boolean;
  @Element() el;

  dragY: number = null;
  startY: number = null;
  screenHeight: number = null;

  urls: any;
  URLS = () => {
    const api = 'https://api.swiftype.com/api/v1/public/engines/';
    const key = '9oVyaKGPzxoZAyUo9Sm8';

    return {
      autocomplete: query =>
        `${api}suggest.json?q=${query}&engine_key=${key}`,
      search: query =>
        `${api}search.json?q=${query}&engine_key=${key}`
    };
  }

  constructor() {
    this.activate = this.activate.bind(this);
    this.close = this.close.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.keyNavigation = this.keyNavigation.bind(this);

    this.urls = this.URLS();
  }

  @Listen('window:keyup')
  handleKeyUp(ev) {
    if (ev.key === '/' || ev.code === 'Slash') {
      this.activate();
    }
  }

  // componentDidLoad() {
  //   this.pane = this.el.parentElement.querySelector('.mobile-nav__pane');
  // }

  activate() {
    this.active = true;
    this.el.classList.add('active');
    setTimeout(() => {
      this.el.querySelector('input').focus();
    }, 220, this);
  }

  close() {
    this.active = false;
    this.el.classList.remove('active');
    this.el.querySelector('input').blur();
    setTimeout(() => {
      this.el.querySelector('input').value = '';
      this.results = this.nonDocsResults = this.higlightIndex = null;
    }, 220, this);
  }

  async onKeyUp(e) {
    if (e.keyCode === 27) {
      this.close();
      return;
    }

    // don't search on arrow keypress
    if ([37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
      return;
    }

    if (e.target.value.length < 3) {
      this.results = this.nonDocsResults = this.higlightIndex = null;
      return;
    }

    this.query = e.target.value;
    this.pending++;
    const resp = await fetch(this.urls.autocomplete(this.query));
    const res = await resp.json();
    this.pending--;
    this.results = res.records.page.filter(
      item => item.url.indexOf('\/docs\/') !== -1);
    this.nonDocsResults = res.records.page.filter(
      item => item.url.indexOf('\/docs\/') === -1);
    this.higlightIndex = null;
  }

  touchStart(e) {
    this.screenHeight = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
    this.startY = Math.round(e.touches.item(0).screenY);
  }

  touchMove(e) {
    e.preventDefault();
    this.dragY = Math.max(0, Math.round(
      (e.touches.item(0).screenY - this.startY) / this.screenHeight * 100
    ));
    this.dragStyles = {
      transitionDuration: '.1s',
      transform: `translate3d(0, ${this.dragY}%, 0)`
    };
    // window.requestAnimationFrame(()=> {
    //   const scale = ((3 * this.dragY / 100) + 97) / 100;
    //   this.pane.style.transform = `scale3d(${scale}, ${scale}, 1)`;
    //   this.pane.style['transition-duration'] = '.1s';
    // });
  }

  isFirefox() {
    return navigator.userAgent.indexOf('Firefox') !== -1;
  }

  touchEnd() {
    if (this.dragY > 30) {
      this.close();
    }
    this.dragY = null;
    this.startY = null;
    this.dragStyles = {};
  }

  keyNavigation(ev) {
    if (!this.results) return;

    if (ev.keyCode === 38) {
      ev.preventDefault();
      if (this.higlightIndex === 0) {
        this.el.querySelector('input').focus();
        this.higlightIndex = null;
      } else if (this.higlightIndex !== null && this.higlightIndex > 0) {
        this.higlightIndex--;
      }
    } else if (ev.keyCode === 40) {
      ev.preventDefault();
      if (this.higlightIndex === null) {
        this.higlightIndex = 0;
      } else if (
        this.higlightIndex !== null &&
        this.higlightIndex < this.results.length + this.nonDocsResults.length - 1) {
        this.higlightIndex++;

        if (
          this.higlightIndex >= this.results.length &&
          !this.nonDocsResultsActive
        ) {
          this.nonDocsResultsActive = true;
        }
      }
    } else if (ev.keyCode === 13) {
      const link = this.el.querySelector('ul a.active');
      if (link) {
        window.location = link.href;
      }
    }
  }

  render() {
    return [
      <div class={`search-box${this.active ? ' active' : ''}`}
           style={this.dragStyles}
           onTouchMove={e => this.results && this.results.length > 5 ?
            null : e.preventDefault()}
           onKeyDown={this.keyNavigation}>
        <input type="text" onKeyUp={this.onKeyUp} placeholder="Search Ionic.."/>

        <Search class={`search-static ${this.active ? ' active' : ''}`}/>

        {this.mobile && !this.isFirefox() ?
          <div class="mobile-close"
               onClick={this.close}
               onTouchStart={this.touchStart}
               onTouchMove={this.touchMove}
               onTouchEnd={this.touchEnd}>
            <Close/>
          </div>
          :
          <ion-icon class={`close ${this.active ? ' active' : ''}`}
                    name="md-close"
                    onClick={this.close}></ion-icon>
        }
        {this.results !== null ?
          <div class="SearchResults">
            <ul>
              {this.results.map((result, i) =>
                <li>
                  <a href={result.url}
                     title={result.title}
                     class={i === this.higlightIndex ? 'active' : ''}>
                    <Book/>
                    <strong>{result.title}</strong>
                    <span innerHTML={result.highlight.sections}></span>
                  </a>
                </li>
              )}
              {this.results.length === 0 ?
                <li><span class="no-results">No results</span></li>
              : null}
            </ul>

            <div class={`SearchMore ${this.nonDocsResultsActive ? 'active' : ''}`}>
              {this.nonDocsResults && this.nonDocsResults.length !== 0 ? [
                <a class="SearchMore__link"
                   onClick={() =>
                    this.nonDocsResultsActive = !this.nonDocsResultsActive}>
                  {this.nonDocsResults.length} Results outside docs <ForwardArrow/>
                </a>,
                <ul class="SearchMore__list">
                  {this.nonDocsResults.map((result, i) =>
                    <li>
                      <a href={result.url}
                         title={result.title}
                         class={i + this.results.length === this.higlightIndex ? 'active' : ''}>
                        <strong>{result.title}</strong>
                        <span innerHTML={result.highlight.sections}></span>
                      </a>
                    </li>
                  )}
                </ul>
              ] : null}
            </div>
          </div>
        : null}

        <div class={`slot ${this.results === null ? '' : 'hidden'}`}>
          <slot/>
        </div>

        {this.pending > 0 ? <span class="searching"></span> : null}
      </div>,

      <div class={`SearchBtn ${this.active ? ' active' : ''}`}>
        <Search class="SearchBtn__sm"
                onClick={this.active ? null : this.activate}/>

        <div class="SearchBtn__lg" onClick={this.active ? null : this.activate}>
          <Search class="SearchBtn__lg__icon"/>
          <span class="SearchBtn__lg__text">Search docs</span>
          <span class="SearchBtn__lg__key">/</span>
        </div>
      </div>,

      <div class={`backdrop ${this.active ? 'active' : null}`}
           onClick={this.close}></div>
    ];
  }
}

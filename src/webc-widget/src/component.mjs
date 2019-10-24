import { css } from './style.mjs';

const template = document.createElement('template');
template.innerHTML =
  // html
  `<style>
    ${css}
</style>
<div class="card">
    <div class="header">
        <img class="dev-logo" src="https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg" alt="Saurabh Daware's DEV Profile">
    </div>
    <div class="content">

    </div>
</div>
`;

// Throughout this class 'this' refers to the element <webc-widget />
export class Widget extends HTMLElement {
    constructor() {
        super();

        // Append template to shadow root
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Methods from parent class HTMLElement.

    static get observedAttributes() {
        return ['data-width'];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (attr == 'data-width' && oldValue != newValue) {
            this[attr] = newValue;
            this.setWidth();
        }
    }

    connectedCallback() {
        // mounted
        this.render();
    }

    // Custom Methods of this class

    renderArticles(articles) {
        for (let article of articles) {
            this._shadowRoot.querySelector('.content').innerHTML +=
        // html
        `
                <a href="${article.url}" target="_blank" class="article-card">
                    <span class="title">${article.title}</span><br>
                    <div class="article-icon">
                        <img src="https://res.cloudinary.com/saurabhdaware/image/upload/v1571587358/saurabh2019/heart-solid.svg">
                        <span> ${article.positive_reactions_count}</span>
                        &nbsp;&nbsp;
                        <img src="https://res.cloudinary.com/saurabhdaware/image/upload/v1571587349/saurabh2019/comment-solid.svg">
                        <span> ${article.comments_count}</span>
                    </div>
                </a>
            `;
        }
    }

    createCard() {
    // Main logic goes here
        const header = this._shadowRoot.querySelector('.header');
        const content = this._shadowRoot.querySelector('.content');
        let data = {};
        if (this.articles.length == 0) {
            data = {
                profilePic: false,
                name: this.dataset.name || this.dataset.username,
                url: 'https://dev.to/' + this.dataset.username
            };
        } else {
            data = {
                profilePic: this.articles[0].user.profile_image_90,
                name: this.dataset.name || this.articles[0].user.name,
                url: 'https://dev.to/' + this.articles[0].user.username
            };
        }
        // const profilePic = this.articles[0].user.profile_image_90;

        header.innerHTML +=
      // html
      `
            ${
    data.profilePic
        ? `<img class="profile-pic" src="${data.profilePic}">`
        : ''
}
            <div class="name-container" ${
    data.profilePic ? '' : 'style="margin-left:20px;"'
}>
                <span>${data.name}</span>
                <div class="view-profile-container">
                    <a target="_blank" class="view-profile-button" href="${
    data.url
}">View Profile</a>
                </div>
            </div>
        `;

        content.innerHTML = '';
        if (this.articles.length === 0) {
            // IF no articles
            content.style.maxHeight = '0px';
            content.style.minHeight = '0px';
            return;
        }
    }

    setWidth() {
        this.style.width = this.dataset.width || '300px';
    }

    fetchArticles(pageNumber, articlesNumber = 30) {
        return fetch(
            'https://dev.to/api/articles?username=' +
        this.dataset.username +
        '&page=' +
        pageNumber
        )
            .then(res => res.json())
            .then(articles => {
                this.articles = articles;
                if (pageNumber === 1) {
                    this.createCard();
                }
                this.renderArticles(this.articles.slice(0, articlesNumber));
                if (this.articles.length === 30 && pageNumber < this.pageLimit) {
                    if (pageNumber + 1 === this.pageLimit) {
                        // IF(Last page):
                        this.fetchArticles(++pageNumber, this.limit % 30);
                    } else {
                        this.fetchArticles(++pageNumber); // Calling recursively until pageLimit reached
                    }
                }
            });
    }

    render() {
        this.style.display = 'inline-block';
        this.articles = [];
        this.limit = this.dataset.limit || 30;
        this.pageLimit = Math.ceil(this.limit / 30);
        this.setWidth();
        this.fetchArticles(1, this.limit).catch(err => console.error(err));
    }
}

customElements.define('webc-widget', Widget);

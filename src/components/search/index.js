import './search.css';
class Search {
    constructor(parent = document.body,callback = () => {}) {
        const searchPage = this.createDom(parent);
        this.el = {
            searchPage: searchPage,
            searchForm: searchPage.querySelector('.search-form'),
            searchInput: searchPage.querySelector('.search-input'),
            cancelBtn: searchPage.querySelector('.search-cancel-btn'),
            deleteBtn: searchPage.querySelector('.history-delete-btn'),
            historyWrap: searchPage.querySelector('.history'),
            historyBtns: searchPage.querySelectorAll('.history .search-tag') || []
        }
        this.setRecommendDom();
        this.bindEvent();
        this.searchCallback = callback;
    }
    createDom(parent) {
        var dom = document.createElement('section');
        dom.classList.add('search-page');
        var formHTML = `
        
            <form class="search-form">
                <div class="search-group">
                    <input class="search-btn" type="submit" value="">
                    <input class="search-input" type="search" placeholder="输入关键词">
                </div>
                <div class="search-cancel-btn">取消</div>
            </form>
            ${this.HistoryDom}
            `;
        dom.innerHTML = formHTML;
        parent.appendChild(dom);
        return dom;
    }
    bindEvent() {
        const {searchForm,cancelBtn,deleteBtn,historyBtns,searchInput,historyWrap} = this.el;
        searchForm.addEventListener('submit',e => {
            e.preventDefault();
            this.search(searchInput.value);
        });
        cancelBtn.addEventListener('click',e => {
            this.hide();
        });
        if(deleteBtn) deleteBtn.addEventListener('click',e => {
            this.clearHistory();
            historyWrap.remove();
        });
        // 历史按钮
        Array.from(historyBtns)
        .forEach(btn => {
            btn.addEventListener('click',e => {
                this.search(btn.innerText);
            });
        });
    }
    get HistoryDom() {
        const tagDomList = this.getHistory().map(function(item) {
            return `<span class='search-tag'>${item}</span>`;
        }).join('');
        if(tagDomList.length) return `
            <div class='history tag-box'>
                <div class='tag-header'>
                    <h4 class='tag-title'>历史记录</h4>
                    <div class='history-delete-btn'></div>
                </div>
                ${tagDomList}
            </div>`;
        else return "";
    }
    async setRecommendDom() {
        const {searchPage,searchInput} = this.el;
        let recommendist = await this.getRecommend();
        let tagDomList = recommendist.map(function(item) {
            return `<span class='search-tag'>${item}</span>`;
        }).join('');
        const html =  `
            <hr>
            <div class='tag-header'>
                <h4 class='tag-title'>热门推荐</h4>
            </div>
            <div class='tag-content'>
                ${tagDomList}
            </div>
        `;
        const dom = document.createElement('div');
        dom.classList.add('recommend','tag-box');
        dom.innerHTML = html;
        searchPage.appendChild(dom);
        this.el.recommendBtns = dom.querySelectorAll('.recommend .search-tag') || [];
        searchInput.placeholder = recommendist[0];
        // 推荐
        Array.from(this.el.recommendBtns)
        .map(btn => {
            return btn.addEventListener('click',e => {
                this.search(btn.innerText);
            });
        });
    }
    show() {
        this.el.searchPage.setAttribute('show','');
        this.el.searchInput.focus();
    }
    hide() {
        this.el.searchPage.removeAttribute('show');
    }
    async search(keyword) {
        if (!keyword || !keyword.trim()) return;
        let result;
        try {
            result = await this.fetchData(`/search?keyword=${keyword}`);
        } catch(err) {

        }
        console.log(result);
        this.hide();
        this.searchCallback(result);
        this.setHistory(keyword);
    }
    async getRecommend() {
        let result;
        try {
            result = await this.fetchData(`/recommend`);
        } catch (err) {

        }
        return result.list || [];
    }
    fetchData(url,method = 'get',body) {
        return fetch(url,{
            method: method,
            body,
            credentials: "same-origin"
        }).then(res => res.json());
    }
    /**
     * @return {Array}
     */
    getHistory() {
        return JSON.parse(localStorage.getItem('search')) || [];
    }
    /**
     * @param {String}
     */
    setHistory(key) {
        let keywords = this.getHistory();
        if (!keywords) keywords = [];
        const index = keywords.indexOf(key);
        if (~index) {
            keywords.splice(index,1);
        }
        keywords.unshift(key);
        localStorage.setItem('search',JSON.stringify(keywords));
    }
    clearHistory() {
        localStorage.removeItem('search');
    }
}
export default Search;
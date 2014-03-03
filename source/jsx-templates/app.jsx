/**
 * @jsx React.DOM
 */

/* globals React, Router, superagent */

React.initializeTouchEvents(true);

(function () {})();

var app = app || {};

app.ALL_STORIES = 'home';

var Feedback = React.createClass({
  render: function () {
    return (
      <div className='app__feedback'>
      </div>
    );
  }
});

var StoryFeed = React.createClass({
  render: function () {
    var stories = [{title: 'Bafta fellowship for Rockstar Games', excerpt: "The makers of games including the Grand Theft Auto series will be presented with a Bafta fellowship at this year's British Academy Games Awards"}, {title: "Russia 'demands Crimea surrender'", excerpt: "The Russian military has given Ukrainian forces in Crimea until 03:00 GMT on Tuesday to surrender or face an assault, Ukrainian defence sources say."}];
    
    var createStoryItem = function (item) {
      return (
        <li>
          <h2>{item.title}</h2>
        </li>
      );
    }.bind(this);

    return (
      <div className='app__content--feed'>
        <ul>
          {stories.map(createStoryItem)}
        </ul>
      </div>
    );
  }
});

var Clustter = React.createClass({
  getInitialState: function () {
    return {
      nowShowing: app.ALL_STORIES,
      editing: null
    };
  },
  componentDidMount: function () {
    var setState = this.setState;
    var router = Router({
      '/story/:storyId': [function (storyId) { console.log("should get stor " + storyId); }],
      '/': setState.bind(this, {nowShowing: app.ALL_STORIES}),
    });
    router.init('/');
  },
  handleMenu: function () {
    alert('menu should appear');
  },
  render: function () {
    return (
      <div className='app'>
        <Feedback />
        <div className='app__topbar' onClick={this.handleMenu} onTouchEnd={this.handleMenu}>
        </div>  
        <div className='app__content'>
          <StoryFeed />
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <Clustter />,
  document.body
);
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';
import slideMenu from 'slideout';

import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('tasks');

    this.hideCompleted = false;

    var menu = new slideMenu({
      'panel': document.getElementById('panel'),
      'menu':  document.getElementById('menu'),
      'padding': 256,
      'tolerance': 70
    })

    document.querySelector('.toggle-button').addEventListener('click', function() {
        menu.toggle();
      });

    this.helpers({
      tasks() {
        const selector = {};

        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          }
        }

        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }

  addTask(newTask) {
    Meteor.call('tasks.insert', newTask);

    this.newTask = '';
  }

  setChecked(task) {
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  removeTask(task) {
    Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task) {
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }
}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });

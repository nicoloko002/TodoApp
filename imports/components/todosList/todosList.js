import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.hideCompleted = false;

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
      }
    });
  }

  addTask(newTask) {
    Tasks.insert({
      text: newTask,
      createdAt: new Date
    });
  }

  setChecked(task) {
    Tasks.update(task._id, {
      $set: {
        checked: !task.checked
      }
    })
  }

  removeTask(task) {
    Tasks.remove(task._id);
  }

}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });

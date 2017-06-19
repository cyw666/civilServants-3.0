'use strict';

/**
 * @ngdoc function
 * @name luZhouApp.controller:PersonalcenterCtrl
 * @description
 * # PersonalcenterCtrl
 * Controller of the luZhouApp
 */
angular.module('luZhouApp')
    .controller('PersonalcenterCtrl', function($scope, $http,$timeout, $rootScope, $cookieStore, commonService, $location, $loading) {
        //防伪造请求
        $scope.token = commonService.AntiForgeryToken();
        //退出
        $scope.loginOut = commonService.loginOut;
        //请求用户信息
        $loading.start('loginOut');
        commonService.getData(ALL_PORT.LoginLong.url, 'POST', ALL_PORT.LoginLong.data).then(function(response) {
          $loading.finish('loginOut');
          $scope.userMessage = response.Data;
        });

        //学院学时排行（请勿删除）
        /*$loading.start('studentsHourRanking');
        commonService.getData(ALL_PORT.LeftUserRank.url, 'POST',
                ALL_PORT.LeftUserRank.data)
            .then(function(response) {
                $loading.finish('studentsHourRanking');
                $scope.userRankingData = response.Data;
            });*/


        //个人中心
        $scope.selectedName = {};
        //搜索title
        $scope.searchTitle = '';
      $scope.paginationConf = $.extend({},paginationConf,{itemsPerPage: ALL_PORT.MyCenter.data.rows});
        $scope.courseStatus = [
            { name: '所有', id: 'All' },
            { name: '正在学习课程', id: 'Unfinish' },
            { name: '指定课程', id: 'Appointed' },
            { name: '已完成课程', id: 'Finish' }
        ];
        $scope.vm = {};
        //学习课程请求
        $scope.searchMyCenterCourse = function(option) {
            $loading.start('myCenter');
            var params = $.extend({}, ALL_PORT.MyCenter.data, option);
            //console.log(params);
            commonService.getData(ALL_PORT.MyCenter.url, 'POST',
                    params)
                .then(function(response) {
                    $loading.finish('myCenter');
                    $scope.TotalData = response.Data;
                    if (params.courseType == "Unfinish") {
                      $scope.vm.activeTab = 1;
                        $scope.paginationConf.totalItems = response.Data.UnfinishCount;
                    } else if (params.courseType == "Appointed") {
                      $scope.vm.activeTab = 2;
                        $scope.paginationConf.totalItems = response.Data.AppointedCount;
                    } else if (params.courseType == "Finish") {
                      $scope.vm.activeTab = 3;
                        $scope.paginationConf.totalItems = response.Data.FinishCount;
                    } else if (params.courseType == "All") {
                        if ($scope.vm.activeTab == 1) {
                            $scope.paginationConf.totalItems = response.Data.UnfinishCount;
                        } else if ($scope.vm.activeTab == 2) {
                            $scope.paginationConf.totalItems = response.Data.AppointedCount;
                        } else if ($scope.vm.activeTab == 3) {
                            $scope.paginationConf.totalItems = response.Data.FinishCount;
                        }
                    }
                });
        }
        $scope.searchMyCenterCourse();
        //学习进度排序
        $scope.learningProgress = function(type) {
            if ($('.getorder span').html() == '▼') {
                $('.getorder span').html('▲');
                $scope.searchMyCenterCourse({ order: 'asc', courseType: type });
            } else {
                $('.getorder span').html('▼');
                $scope.searchMyCenterCourse({ order: 'desc', courseType: type });
            }
        };


        //分页
        // 通过$watch currentPage 当他们一变化的时候，重新获取数据条目
        $scope.$watch('paginationConf.currentPage', function() {
            // 发送给后台的请求数据
            var pageOptions = {
                page: $scope.paginationConf.currentPage,
                title: $scope.searchTitle
            };
            $scope.searchMyCenterCourse(pageOptions);
        });

        $scope.modalBody1 = true;
        $scope.modalBody2 = false;
        $scope.modalBody21 = true;
        //添加笔记
        $scope.courseId = '';
        $scope.nodeAdd = function(id) {
            $scope.courseId = id;
            $scope.modalBody1 = true;
            $scope.modalBody2 = false;
            commonService.getData(ALL_PORT.NoteAdd.url, 'POST',
                    $.extend({}, ALL_PORT.NoteAdd.data, { courseId: id }))
                .then(function(response) {
                    $scope.nodeAddData = response.Data;
                    $scope.noteName = '';
                    $scope.noteContent = '';
                });
        };

        //编辑笔记后提交请求
        $scope.editNote = function(options) {
            var editNoteParams = $.extend({}, ALL_PORT.AddNote.data, $scope.token, options);
            if (editNoteParams.Name.length < 2) {
                alert('笔记名称字数不能少于2个字！');
            } else if (editNoteParams.Content.length < 7) {
                alert('笔记内容字数不能少于7个字');
            } else if (editNoteParams.Content.length >= 249) {
                alert('笔记内容字数不能超过249个字');
            } else if (editNoteParams.Name.length >= 2 && editNoteParams.Content.length < 249) {
                commonService.getData(ALL_PORT.AddNote.url, 'POST',
                        editNoteParams)
                    .then(function(response) {
                        $('.modal').modal('hide');
                        alert('添加完成！')
                        if ($scope.vm.activeTab == 1) {
                            $scope.searchMyCenterCourse({ 'courseType': 'Unfinish', 'title': $scope.searchTitle });
                        } else if ($scope.vm.activeTab == 2) {
                            $scope.searchMyCenterCourse({ 'courseType': 'Appointed', 'title': $scope.searchTitle });
                        } else {
                            $scope.searchMyCenterCourse({ 'courseType': 'Finish', 'title': $scope.searchTitle });

                        }
                    });
            }

        }

        //查看笔记
        $scope.courseName = '';
        $scope.seeNote = function(id, courseName) {
            $scope.courseId = id;
            $scope.courseName = courseName;
            $scope.modalBody1 = false;
            $scope.modalBody2 = true;
            $scope.modalBody21 = true;
            commonService.getData(ALL_PORT.CourseNoteList.url, 'POST',
                    $.extend({}, ALL_PORT.CourseNoteList.data, { CourseId: id }))
                .then(function(response) {
                    response.Data.CourseName = courseName;
                    $scope.seeNoteData = response.Data;

                    /*$('.modal').modal('hide');
                    alert('添加完成！')*/
                });
        }

        //编辑
        $scope.noteid = '';
        $scope.noteUpdate = function(id) {
            $scope.noteid = id;
            $scope.modalBody1 = false;
            $scope.modalBody2 = true;
            $scope.modalBody21 = false;

            $http.get(ALL_PORT.NoteUpdate.url,{params:{ noteid: id }}).success(function (response) {
              $scope.noteName = response.Name;
              $scope.noteContent = response.Content;
            });

        }

        //提交编辑
        $scope.addNoteUpdate = function(options) {
            commonService.getData(ALL_PORT.NoteUpdate.url, 'POST',
                $.extend({}, ALL_PORT.NoteUpdate.data, $scope.token, options, { Id: $scope.noteid }))

            .then(function(response) {
                if (response.Type == 1) {
                    alert('更新成功');
                    $('.modal').modal('hide');
                }
            });
        }

        //删除笔记
        $scope.delNote = function(id) {
            commonService.getData(ALL_PORT.DelNote.url, 'POST',
                $.extend({}, ALL_PORT.DelNote.data, $scope.token, { Id: id }))

            .then(function(response) {
                if (response.Type == 1) {
                    alert("删除成功！");
                    $scope.seeNote($scope.courseId, $scope.courseName);
                    if ($scope.vm.activeTab == 1) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Unfinish', 'title': $scope.searchTitle });
                    } else if ($scope.vm.activeTab == 2) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Appointed', 'title': $scope.searchTitle });
                    } else {
                        $scope.searchMyCenterCourse({ 'courseType': 'Finish', 'title': $scope.searchTitle });

                    }
                }
            });
        }

        //添加计划
        $scope.remindCycle = ['每天一次', '每周一次', '每月一次'];
        $scope.planAdd = function(id) {
            $scope.modalBody1 = true;
            $scope.modalBody2 = false;
            commonService.getData(ALL_PORT.StudyPlanAdd.url, 'POST',
                    $.extend({}, ALL_PORT.StudyPlanAdd.data, { courseId: id }))
                .then(function(response) {
                    $scope.selectedName2 = $scope.remindCycle[0];
                    $scope.planAddData = response.Data;
                    $scope.PlanFinishDate = commonService.dateFilter(response.Data.PlanFinishDate, 'yyyy-MM-dd');
                    $scope.RemindDate = commonService.dateFilter(response.Data.RemindDate, 'yyyy-MM-dd');

                });
        }

        //提交计划
        $scope.addPlan = function(options) {
            var editPlanParams = $.extend({}, ALL_PORT.AddStudyPlan.data, $scope.token, options);
            // console.log(editPlanParams);
            if (editPlanParams.Remark.length < 7) {
                alert("计划内容字数不能少于7个字！");
            } else if (editPlanParams.Remark.length >= 249) {
                alert('计划内容字数不能超过249个字');
            } else {
                commonService.getData(ALL_PORT.AddStudyPlan.url, 'POST',
                    editPlanParams)

                .then(function(response) {
                    $('.modal').modal('hide');
                    alert('添加完成！')
                    if ($scope.vm.activeTab == 1) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Unfinish', 'title': $scope.searchTitle });
                    } else if ($scope.vm.activeTab == 2) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Appointed', 'title': $scope.searchTitle });
                    } else {
                        $scope.searchMyCenterCourse({ 'courseType': 'Finish', 'title': $scope.searchTitle });
                    }
                });
            }

        }


        //查看计划
        $scope.seePlan = function(id, courseName) {
            $scope.courseId = id;
            $scope.courseName = courseName;
            $scope.modalBody1 = false;
            $scope.modalBody2 = true;
            commonService.getData(ALL_PORT.StudyPlanUpdate.url, 'POST',
                    $.extend({}, ALL_PORT.StudyPlanUpdate.data, { courseId: id }))
                .then(function(response) {
                    response.Data.CourseName = courseName;
                    $scope.seePlanData = response.Data;
                    $scope.selectedName3 = response.Data.RemindCycle;
                    $scope.PlanFinishDate2 = commonService.dateFilter(response.Data.PlanFinishDate, 'yyyy-MM-dd');
                    $scope.RemindDate2 = commonService.dateFilter(response.Data.RemindDate, 'yyyy-MM-dd');

                });
        }

        //提交编辑计划
        $scope.addPlanUpdate = function(options) {
            var addPlanUpdateParams = $.extend({}, ALL_PORT.EditStudyPlanUpdate.data, $scope.token, options);
            if (addPlanUpdateParams.Remark.length < 7) {
                alert("计划内容字数不能少于7个字！");
            } else if (addPlanUpdateParams.Remark.length >= 249) {
                alert('计划内容字数不能超过249个字');
            } else {
                commonService.getData(ALL_PORT.EditStudyPlanUpdate.url, 'POST',
                    addPlanUpdateParams)

                .then(function(response) {
                    $('.modal').modal('hide');
                    alert(response.Message)
                    if ($scope.vm.activeTab == 1) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Unfinish', 'title': $scope.searchTitle });
                    } else if ($scope.vm.activeTab == 2) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Appointed', 'title': $scope.searchTitle });
                    } else {
                        $scope.searchMyCenterCourse({ 'courseType': 'Finish', 'title': $scope.searchTitle });
                    }
                });
            }
        }

        //删除课程
        $scope.deleatUserCourse = function(id) {
            commonService.getData(ALL_PORT.DelUserCourseReg.url, 'POST',
                $.extend({}, ALL_PORT.DelUserCourseReg.data, $scope.token, { courseId: id }))

            .then(function(response) {
                if (response.Type == 1) {
                    alert(response.Message)
                    if ($scope.vm.activeTab == 1) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Unfinish', 'title': $scope.searchTitle });
                    } else if ($scope.vm.activeTab == 2) {
                        $scope.searchMyCenterCourse({ 'courseType': 'Appointed', 'title': $scope.searchTitle });
                    } else {
                        $scope.searchMyCenterCourse({ 'courseType': 'Finish', 'title': $scope.searchTitle });
                    }
                } else if (response.Type == 0) {
                    alert(response.Message);
                }

            });
        };

        //查看考试列表
        $scope.courseExamList = function(id) {
            commonService.getData(ALL_PORT.CourseExamList.url, 'POST',
                    $.extend({}, ALL_PORT.CourseExamList.data, { courseId: id }))
                .then(function(response) {
                    $scope.courseExamListData = response.Data;
                });
        };

        //参加测试
        $scope.havTest = function(Id) {
            var params = $.extend({}, ALL_PORT.Exam.data, $scope.token, { parameter1: Id })
            commonService.getData(ALL_PORT.Exam.url, 'POST',
                params

            ).then(function(response) {
                if (response.Type) {
                    //Type存在，意味着不能考试
                    alert(response.Message);
                } else {
                    window.open("#/exam/exam/" + Id);
                }

            });
        };

    });

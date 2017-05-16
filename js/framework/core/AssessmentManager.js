define([
    'jquery',
    'framework/utils/Logger',
    'framework/core/score/ScoreManager',
], function($, Logger, ScoreManager) {
    var __instanceAssessmentManager;
    var _question_set;
    var _pass_per;
    var _question_set_not_disp;
    function AssessmentManager() {
        //Logger.logDebug('AssessmentManager.CONSTRUCTOR() | ');
        this.courseControllerRef;

    }

    AssessmentManager.prototype.init = function(courseControllerRef) {
        //Logger.logDebug('AssessmentManager.init() | '+p_htmlActivityMarkup);
        _question_set = [];
        _pass_per = "";
        this.courseControllerRef = courseControllerRef;
        this.setQuestionSet(this.courseControllerRef); // To handle radomization -- Pooja
    };

    AssessmentManager.prototype.isPass = function() {
        //Logger.logDebug('AssessmentManager.init() | '+p_htmlActivityMarkup);
        achieved_per = ScoreManager.getTotalAchievedScore() * 100 / ScoreManager.getTotalMaxPossibleScore().toFixed();
        if (achieved_per > _pass_per)
            return true;
        else
            return false;
    };
    AssessmentManager.prototype.setQuestionSet = function(m_assessment) {

        c_assessments = m_assessment.aChildPages.slice(m_assessment.sCWPagesFromStart, -m_assessment.sCWPagesFromEnd);

        if (typeof m_assessment.sCWPickQuestions != "undefined") {
            if (m_assessment.sCWRandomization == "true") {
                var result = [], taken = [], len = c_assessments.length;
                if (m_assessment.sCWPickQuestions > len)
                    throw new RangeError("setQuestionSet: more elements taken than available");
                while (m_assessment.sCWPickQuestions > 0) {
                    var x = Math.floor(Math.random() * len);
                    if ($.inArray(x, taken) == -1) {
                        result.push(c_assessments[x]);
                        taken.push(x);
                        m_assessment.sCWPickQuestions--;
                    }
                }
            }
            else
            {
                result = c_assessments.slice(0, m_assessment.sCWPickQuestions);
            }
            _question_set = result;
        }
        else {
            if (m_assessment.sCWRandomization == "true") {
                for (var j, x, i = c_assessments.length; i; j = Math.floor(Math.random() * i), x = c_assessments[--i], c_assessments[i] = c_assessments[j], c_assessments[j] = x)
                    ;
            }
            _question_set = c_assessments;
        }

        _question_set_not_disp = c_assessments.filter(function(e) {
            return _question_set.indexOf(e) < 0
        });

        
    };
    AssessmentManager.prototype.getQuestionSet = function() {
        //Logger.logDebug('AssessmentManager.init() | '+p_htmlActivityMarkup);
        return(_question_set);
    };
    AssessmentManager.prototype.getQuestionSetNotDisp = function() {
        //Logger.logDebug('AssessmentManager.init() | '+p_htmlActivityMarkup);
        return(_question_set_not_disp);
    };

    AssessmentManager.prototype.toString = function() {
        return 'framework/core/AssessmentManager';
    };

    if (!__instanceAssessmentManager) {
        __instanceAssessmentManager = new AssessmentManager();
        //Logger.logDebug('^^^^^^^^^^^^ Activity Markup Wrapper INSTANCE ^^^^^^^^^^^^^^ '+__instanceAssessmentManager);
    }

    return __instanceAssessmentManager;
});

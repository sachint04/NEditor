define([
	'jquery',
	'framework/utils/Logger'
], function($, Logger){
	function BookmarkMinifier(){
		//Logger.logDebug('BookmarkMinifier.CONSTRUCTOR() | ');
		//EventDispatcher.call(this);
		this.oJSON = {
			  "cw01~cw01~support_basemap#support_base_map": "01",
			  "cw01~cw01~value_statement#value_statement": "02",
			  "cw01~cw01~differentiation_analysis#differentiation_analysis_maintain": "03",
			  "cw01~cw01~differentiation_analysis#differentiation_analysis_attack": "04",
			  "cw01~cw01~differentiation_analysis#differentiation_analysis_defend": "05",
			  "cw01~cw01~differentiation_analysis#differentiation_analysis_explore": "06",
			  "cw01~cw01~strategy_selection#mcqgroup_direct": "07",
			  "cw01~cw01~strategy_selection#mcqgroup_indirect": "08",
			  "cw01~cw01~strategy_selection#mcqgroup_divisional": "09",
			  "cw01~cw01~strategy_selection#mcqgroup_containment": "10",
			  "cw01~cw01~strategy_selection#mcqgroup_our_direct": "11",
			  "cw01~cw01~strategy_selection#mcqgroup_while_direct": "12",
			  "cw01~cw01~strategy_selection#mcqgroup_thus_direct": "13",
			  "cw01~cw01~strategy_selection#mcqgroup_our_indirect": "14",
			  "cw01~cw01~strategy_selection#mcqgroup_to_indirect": "15",
			  "cw01~cw01~strategy_selection#mcqgroup_achieve_indirect": "16",
			  "cw01~cw01~strategy_selection#mcqgroup_while_indirect": "17",
			  "cw01~cw01~strategy_selection#mcqgroup_our_divisional": "18",
			  "cw01~cw01~strategy_selection#mcqgroup_advancing_divisional": "19",
			  "cw01~cw01~strategy_selection#mcqgroup_while_divisional": "20",
			  "cw01~cw01~strategy_selection#mcqgroup_leveraging_divisional": "21",
			  "cw01~cw01~strategy_selection#mcqgroup_our_containment": "22",
			  "cw01~cw01~strategy_selection#mcqgroup_in_containment": "23",
			  "cw01~cw01~strategy_selection#mcqgroup_while_containment": "24",
			  "cw01~cw01~strategy_selection#mcqgroup_and_containment": "25",
			  "cw01~cw01~strategy_selection#mcqgroup_thus_containment": "26",
			  "cw01~cw01~value_praposition#value_praposition":"27",
			  "cw01~cw01~interactiondit1#interaction_1":"28",
			  "cw01~cw01~interactioncfo2#interaction_2":"29",
			  "cw01~cw01~interactionvps1#interaction_3":"30",
			  "cw01~cw01~interactioncmo1#interaction_4":"31",
			  "cw01~cw01~interactiondit2#interaction_5":"32",
			  "cw01~cw01~interactionmkt1#interaction_6":"33",
			  "cw01~cw01~interactionops1#interaction_7":"34",
			  "cw01~cw01~interactionops2#interaction_8":"35",
			  "cw01~cw01~interactionvpit1#interaction_9":"36",
			  "cw01~cw01~interactionvpit2#interaction_10":"37",
			  "cw01~cw01~interactionvpitvs#interaction_11":"38",
			  "groupIDIndex":"39",
			  "dropDownIDs":"40",
			  "selectedOptionID":"41"
		};
		return this;
	};

	//BookmarkMinifier.prototype								= Object.create(EventDispatcher.prototype);
	//BookmarkMinifier.prototype.constructor					= BookmarkMinifier;

	BookmarkMinifier.prototype = {
		constructor : BookmarkMinifier,
		inflate : function(p_sBookmarkData){

		},
		deflate : function(p_sBookmarkData){
			this.helper(p_sBookmarkData);
		},
		helper : function(p_sBookmarkData){
			for(var sProp in this.oJSON){
				var sValueToReplaceWith	= this.oJSON[sProp],
					nStartIndex			= p_sBookmarkData.indexOf(sProp);

				if(nStartIndex > -1){
					var nEndIndex	= nStartIndex + sProp.length,
						sFirstPart	= p_sBookmarkData.substring(0, nStartIndex),
						sSecondPart	= p_sBookmarkData.substring(nStartIndex, nEndIndex),
						sThirdPart	= p_sBookmarkData.substring(nEndIndex, p_sBookmarkData.length);

					p_sBookmarkData = sFirstPart +  sValueToReplaceWith + sThirdPart;
				}
			}
		}
	};

	return {
		inflate : inflate,
		deflate : deflate
	};
});

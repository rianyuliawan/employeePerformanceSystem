// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EmployeePerformanceAudit {
    enum EvaluationStatus {
        Draft,
        Submitted,
        Reviewed,
        Approved,
        PromotionRecommended,
        PromotionApproved
    }

    enum PromotionStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Evaluation {
        string evaluationId;
        string employeeId;
        bytes32 documentHash;
        EvaluationStatus status;
        address createdBy;
        address updatedBy;
        uint256 timestamp;
        bool exists;
    }

    struct Promotion {
        string promotionId;
        string evaluationId;
        string employeeId;
        bytes32 promotionHash;
        PromotionStatus status;
        address approvedBy;
        uint256 timestamp;
        bool exists;
    }

    address public owner;
    mapping(address => bool) public managers;
    mapping(address => bool) public hrUsers;
    mapping(address => bool) public directors;
    mapping(string => Evaluation) private evaluations;
    mapping(string => Promotion) private promotions;

    event EvaluationSubmitted(string evaluationId, address manager, uint256 timestamp);
    event EvaluationReviewed(string evaluationId, address reviewer, uint256 timestamp);
    event EvaluationApproved(string evaluationId, address approver, uint256 timestamp);
    event PromotionRecommended(string evaluationId, address manager, uint256 timestamp);
    event PromotionApproved(string promotionId, address director, uint256 timestamp);
    event DocumentVerified(string evaluationId, bool valid, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyManager() {
        require(managers[msg.sender], "Only manager");
        _;
    }

    modifier onlyHR() {
        require(hrUsers[msg.sender], "Only HR");
        _;
    }

    modifier onlyDirector() {
        require(directors[msg.sender], "Only director");
        _;
    }

    constructor() {
        owner = msg.sender;
        managers[msg.sender] = true;
        hrUsers[msg.sender] = true;
        directors[msg.sender] = true;
    }

    function setRole(address account, bool isManager, bool isHR, bool isDirector) external onlyOwner {
        managers[account] = isManager;
        hrUsers[account] = isHR;
        directors[account] = isDirector;
    }

    function submitEvaluation(
        string calldata evaluationId,
        string calldata employeeId,
        bytes32 documentHash
    ) external onlyManager {
        require(!evaluations[evaluationId].exists, "Evaluation exists");

        evaluations[evaluationId] = Evaluation({
            evaluationId: evaluationId,
            employeeId: employeeId,
            documentHash: documentHash,
            status: EvaluationStatus.Submitted,
            createdBy: msg.sender,
            updatedBy: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit EvaluationSubmitted(evaluationId, msg.sender, block.timestamp);
    }

    function reviewEvaluation(string calldata evaluationId) external onlyHR {
        Evaluation storage evaluation = requireEvaluation(evaluationId);
        require(evaluation.status == EvaluationStatus.Submitted, "Invalid status");
        evaluation.status = EvaluationStatus.Reviewed;
        evaluation.updatedBy = msg.sender;
        evaluation.timestamp = block.timestamp;
        emit EvaluationReviewed(evaluationId, msg.sender, block.timestamp);
    }

    function approveEvaluation(string calldata evaluationId) external onlyHR {
        Evaluation storage evaluation = requireEvaluation(evaluationId);
        require(evaluation.status == EvaluationStatus.Reviewed, "Invalid status");
        evaluation.status = EvaluationStatus.Approved;
        evaluation.updatedBy = msg.sender;
        evaluation.timestamp = block.timestamp;
        emit EvaluationApproved(evaluationId, msg.sender, block.timestamp);
    }

    function recommendPromotion(string calldata evaluationId) external onlyManager {
        Evaluation storage evaluation = requireEvaluation(evaluationId);
        require(evaluation.status == EvaluationStatus.Approved, "Invalid status");
        evaluation.status = EvaluationStatus.PromotionRecommended;
        evaluation.updatedBy = msg.sender;
        evaluation.timestamp = block.timestamp;
        emit PromotionRecommended(evaluationId, msg.sender, block.timestamp);
    }

    function approvePromotion(
        string calldata promotionId,
        string calldata evaluationId,
        bytes32 promotionHash
    ) external onlyDirector {
        Evaluation storage evaluation = requireEvaluation(evaluationId);
        require(evaluation.status == EvaluationStatus.PromotionRecommended, "Invalid status");

        evaluation.status = EvaluationStatus.PromotionApproved;
        evaluation.updatedBy = msg.sender;
        evaluation.timestamp = block.timestamp;

        promotions[promotionId] = Promotion({
            promotionId: promotionId,
            evaluationId: evaluationId,
            employeeId: evaluation.employeeId,
            promotionHash: promotionHash,
            status: PromotionStatus.Approved,
            approvedBy: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit PromotionApproved(promotionId, msg.sender, block.timestamp);
    }

    function verifyDocument(string calldata evaluationId, bytes32 documentHash) external returns (bool) {
        Evaluation storage evaluation = requireEvaluation(evaluationId);
        bool valid = evaluation.documentHash == documentHash;
        emit DocumentVerified(evaluationId, valid, block.timestamp);
        return valid;
    }

    function getEvaluation(string calldata evaluationId) external view returns (Evaluation memory) {
        return requireEvaluation(evaluationId);
    }

    function getPromotion(string calldata promotionId) external view returns (Promotion memory) {
        require(promotions[promotionId].exists, "Promotion not found");
        return promotions[promotionId];
    }

    function requireEvaluation(string calldata evaluationId) private view returns (Evaluation storage) {
        Evaluation storage evaluation = evaluations[evaluationId];
        require(evaluation.exists, "Evaluation not found");
        return evaluation;
    }
}

